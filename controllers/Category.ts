import { sendFirstErrorMessage } from "@/app/Helper";
import { getAdminFromSession } from "@/app/Helper/server";
import { ICategory } from "@/Interface";
import Category from "@/models/Category";
import { CategoryUpdateSchema, CategoryUploadSchema } from "@/schema";
import { NextRequest, NextResponse } from "next/server";


export const fetchCategories = async () => {

      if (!await getAdminFromSession()) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }

      const order = [
            "Cheeky Deals",
            "Bundles",
            "Exotic Grow",
            "UK Grow",
            "Hash",
            "Pre Rolls",
            "Vapes",
            "Extracts",
            "Edibles",
            "Shake",
            "Trim",
            "Mixers",
            "Accessories"
      ];

      const categories = await Category.find().lean();
      // sort by the custom order
      categories.sort((a, b) => {
            const indexA = order.indexOf(a.name);
            const indexB = order.indexOf(b.name);

            // if not found in order array, push them to the end
            return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
      });

      return NextResponse.json({ status: 'success', categories });
};



export const uploadCategory = async (req: NextRequest) => {

      if (!await getAdminFromSession()) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }

      const result = CategoryUploadSchema.safeParse(await req.json());

      if (!result.success) {
            return NextResponse.json({
                  status: 'failed',
                  message: sendFirstErrorMessage(result),
            }, { status: 400 });
      }

      const categoryObj = result.data;

      // Check if category already exists by slug or name
      const existing = await Category.findOne({
            $or: [
                  { slug: categoryObj.slug },
                  { name: categoryObj.name }
            ]
      });

      if (existing) {
            return NextResponse.json({
                  status: 'failed',
                  message: 'Category with the same name or slug exists.'
            }, { status: 409 }); // 409 Conflict
      }

      const created: ICategory = await Category.create(categoryObj);

      return NextResponse.json({ status: 'success', category: created.toJSON() });
}


export const updateCategory = async (req: NextRequest) => {

      if (!await getAdminFromSession()) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }

      const result = CategoryUpdateSchema.safeParse(await req.json());

      if (!result.success) {
            return NextResponse.json({
                  status: 'failed',
                  message: sendFirstErrorMessage(result),
            }, { status: 400 });
      }

      const updatedObj = result.data;

      // Ensure category ID exists in payload
      if (!updatedObj._id) {
            return NextResponse.json({
                  status: 'failed',
                  message: 'Category ID is required for update.'
            }, { status: 400 });
      }

      const existing = await Category.findById(updatedObj._id);
      if (!existing) {
            return NextResponse.json({
                  status: 'failed',
                  message: 'Category not found.'
            }, { status: 404 });
      }

      // Update and return updated document
      const updatedCategory = await Category.findByIdAndUpdate(updatedObj._id, updatedObj, {
            new: true,
            runValidators: true,
      });

      return NextResponse.json({
            status: 'success',
            category: updatedCategory?.toJSON(),
      });
};

export const deleteCategory = async (req: NextRequest) => {

      if (!await getAdminFromSession()) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }

      const searchParams = req.nextUrl.searchParams;
      const _id = searchParams.get('id');

      if (!_id) {
            return NextResponse.json({
                  status: 'failed',
                  message: 'Category ID is required for deletion.'
            }, { status: 400 });
      }

      const existing = await Category.findById(_id);

      if (!existing) {
            return NextResponse.json({
                  status: 'failed',
                  message: 'Category not found.'
            }, { status: 404 });
      }

      await Category.findByIdAndDelete(_id);

      return NextResponse.json({
            status: 'success',
            message: 'Category deleted successfully.'
      });
};
