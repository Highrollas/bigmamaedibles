
import HtmlParser from '@/app/components/server/HtmlParser';
import AppHeader from '@/app/components/server/partials/AppHeader';
import Footer from '@/app/components/server/partials/Footer/Footer';
import Heading from '@/app/components/server/partials/Heading';
import { generateBlogMetadata } from '@/app/Helper/server';
import { PostObj } from '@/Interface';
import Posts from '@/models/Posts';
import { redirect } from 'next/navigation';
import React from 'react'


interface Props {
      params: Promise<{ slug: string }> | undefined;
}


export async function generateMetadata({ params }: Props) {
      const _params = await params;
      const slug = _params?.slug ? _params!.slug : "no-slug";
      return await generateBlogMetadata({ params: { slug } })
}

const ExplorePageContent = async ({ params }: Props) => {

      if (!params) return

      const { slug } = await params;

      const postObj = await Posts.findOne({ slug }).lean<PostObj>();

      if (!postObj) redirect('/not-found');

      await Posts.updateOne({ slug }, { $inc: { viewsCount: 1 } });

      return (
            <div>
                  <AppHeader />
                  <div className='w-[90%] sm:w-[80%] lg:w-[60%] mx-auto mb-12 mt-6'>

                        <div className='text-center'>
                              <Heading>{postObj.title}</Heading>
                        </div>

                        <div>
                              <HtmlParser text={postObj.content || ""} />
                        </div>
                  </div>
                  <Footer />
            </div>
      )
}

export default ExplorePageContent

