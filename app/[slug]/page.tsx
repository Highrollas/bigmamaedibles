
import { PostObj } from '@/Interface';
import Posts from '@/models/Posts';
import { redirect } from 'next/navigation';
import React from 'react'
import HtmlParser from '../components/server/HtmlParser';
import Footer from '../components/server/partials/Footer/Footer';
import AppHeader from '../components/server/partials/AppHeader';
import Heading from '../components/server/partials/Heading';
import { generateBlogMetadata } from '../Helper/server';

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

                        <div className='text-center mt-10'>
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

