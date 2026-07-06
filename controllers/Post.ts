import { NextRequest, NextResponse } from 'next/server';
import { filterQuery, IPost } from '@/Interface';
import Posts from '@/models/Posts';
import { PostUpdateSchema, PostUploadSchema } from '@/schema';
import { sendFirstErrorMessage } from '@/app/Helper';
import { getAdminFromSession } from '@/app/Helper/server';

export const fetchPosts = async (request: NextRequest, type: string = "post") => {

      if (!await getAdminFromSession()) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }

      const searchParams = request.nextUrl.searchParams;

      // Convert query to a typed filterQuery object
      const query: filterQuery = {
            page: parseInt(searchParams.get('page') || '1', 10),
            itemsPerPage: parseInt(searchParams.get('itemsPerPage') || '25', 10),
            nameSearch: searchParams.get('nameSearch') || undefined,
            dateStart: searchParams.get('dateStart') ? new Date(searchParams.get('dateStart')!) : undefined,
            dateEnd: searchParams.get('dateEnd') ? new Date(searchParams.get('dateEnd')!) : undefined,
      };

      const filter: Record<string, unknown> = {};
      if (query.category) filter.categories = query.category;
      if (query.nameSearch) filter.title = { $regex: query.nameSearch, $options: 'i' };
      if (query.dateStart && query.dateEnd) {
            filter.createdAt = { $gte: query.dateStart, $lte: query.dateEnd };
      }

      filter.type = type;

      const page = query.page || 1;
      const itemsPerPage = query.itemsPerPage || 25;
      const skip = (page - 1) * itemsPerPage;

      const posts = await Posts.find(filter).skip(skip).limit(itemsPerPage).lean();

      return NextResponse.json({ status: 'success', posts });
};


export const uploadPost = async (req: NextRequest, type: "blog" | "post" = "post") => {

      const admin = await getAdminFromSession();
      if (!admin) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }

      const result = PostUploadSchema.safeParse(await req.json());

      if (!result.success) {
            return NextResponse.json({
                  status: 'failed',
                  message: sendFirstErrorMessage(result),
            }, { status: 400 });
      }

      const postObj = result.data as IPost;
      postObj.type = type;
      postObj.creatorId = admin._id;

      // Check if post already exists by slug or name
      const existing = await Posts.findOne({ slug: postObj.slug });

      if (existing) {
            return NextResponse.json({
                  status: 'failed',
                  message: 'Post with the same slug exists.'
            }, { status: 409 });
      }

      const created: IPost = await Posts.create(postObj);

      return NextResponse.json({ status: 'success', post: created.toJSON() });
};


export const updatePost = async (req: NextRequest) => {

      if (!await getAdminFromSession()) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }


      const result = PostUpdateSchema.safeParse(await req.json());

      if (!result.success) {
            return NextResponse.json({
                  status: 'failed',
                  message: sendFirstErrorMessage(result),
            }, { status: 400 });
      }

      const updatedObj = result.data;

      // Ensure post ID exists in payload
      if (!updatedObj._id) {
            return NextResponse.json({
                  status: 'failed',
                  message: 'Post ID is required for update.'
            }, { status: 400 });
      }

      // Update and return updated document
      const updatedPost = await Posts.findByIdAndUpdate(updatedObj._id, updatedObj, {
            new: true,
            runValidators: true,
      });

      if (!updatedPost) {
            return NextResponse.json({
                  status: 'failed',
                  message: 'Post not found.'
            }, { status: 404 });
      }

      return NextResponse.json({
            status: 'success',
            post: updatedPost?.toJSON(),
      });
};

export const deletePost = async (req: NextRequest) => {


      if (!await getAdminFromSession()) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }

      const searchParams = req.nextUrl.searchParams;
      const _id = searchParams.get('id');

      if (!_id) {
            return NextResponse.json({
                  status: 'failed',
                  message: 'Post ID is required for deletion.'
            }, { status: 400 });
      }

      const existing = await Posts.findById(_id);

      if (!existing) {
            return NextResponse.json({
                  status: 'failed',
                  message: 'Post not found.'
            }, { status: 404 });
      }

      await Posts.findByIdAndDelete(_id);

      return NextResponse.json({
            status: 'success',
            message: 'Post deleted successfully.'
      });
};
