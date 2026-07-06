import { PostObj } from '@/Interface';
import Posts from '@/models/Posts';
import React from 'react';
import Footer from '../components/server/partials/Footer/Footer';
import AppHeader from '../components/server/partials/AppHeader';
import Link from 'next/link';
import Image from 'next/image';
import { htmlToText } from '../Helper';
import Heading from '../components/server/partials/Heading';



interface Props {
      searchParams: Promise<{ page: string }> | undefined;
}


const BlogPage = async ({ searchParams }: Props) => {

      if (!searchParams) return

      const { page } = await searchParams;

      const currentPage = parseInt(page || '1', 10);
      const pageSize = 8;
      const totalPosts = await Posts.countDocuments({ type: "blog" });
      const totalPages = Math.ceil(totalPosts / pageSize);

      const blogs = await Posts.find({ type: 'blog' })
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize)
            .lean<PostObj[]>();

      return (
            <div>
                  <AppHeader />
                  <div className="w-[90%] sm:w-[85%] mx-auto mb-12 mt-6">

                        <div className='text-center my-12'>
                              <Heading>Blogs</Heading>
                        </div>

                        <div className="flex flex-wrap sm:justify-start justify-center gap-2">
                              {blogs.map((blog) => (
                                    <div
                                          key={blog._id.toString()}
                                          className="w-[100%] sm:w-[32%] lg:w-[24%] mb-5"
                                    >
                                          <div className="card brand-border-secondary border-3 rounded-md">
                                                <Link href={`/blog/${blog.slug}`}>
                                                      <Image
                                                            src={blog.coverImage || '/assets/images/notFoundImage.jpg'}
                                                            alt={blog.title}
                                                            width={250} height={250}
                                                            className="w-full object-cover h-[200px]"
                                                      />
                                                </Link>
                                                <div className="card-body p-4">
                                                      <h5 className="card-title bl_post-title">
                                                            <Link href={`/blog/${blog.slug}`} className="bl_post-link">
                                                                  {blog.title}
                                                            </Link>
                                                      </h5>
                                                      <div className="card-text bl_post-description">
                                                            {htmlToText(blog.content).slice(0, 150) + '...'}
                                                      </div>
                                                      <Link
                                                            href={`/blog/${blog.slug}`}
                                                            className="btn mt-3"
                                                      >
                                                            Read More
                                                      </Link>
                                                </div>
                                          </div>
                                    </div>
                              ))}
                        </div>


                        {/* Pagination */}
                        {totalPages > 1 && (
                              <div className='w-full flex justify-center'>
                                    <div className="brand-panel-secondary flex justify-center mb-2 border-[3px] gap-[2.5px] brand-border-secondary rounded-[6px] w-fit">
                                          {[...Array(totalPages)].map((_, i) => {
                                                const pageNum = i + 1;
                                                return (
                                                      <Link
                                                            key={pageNum}
                                                            href={`/blog?page=${pageNum}`}
                                                            className={`px-3 py-2 font-bold! flex justify-center items-center w-[40px] ${pageNum === currentPage ? 'brand-panel text-white' : 'bg-white text-black'} ${pageNum == 1 ? 'rounded-s-[4px]' : pageNum == totalPages ? 'rounded-e-[4px]' : ''}`}
                                                      >
                                                            {pageNum}
                                                      </Link>
                                                );
                                          })}
                                    </div>
                              </div>
                        )}

                  </div>
                  <Footer />
            </div>
      );
};

export default BlogPage;

