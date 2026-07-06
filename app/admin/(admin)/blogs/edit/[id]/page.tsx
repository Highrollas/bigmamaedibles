'use client'
import MediaUploader from '@/app/components/client/admin/MediaUploader'
import PostManager from '@/app/components/client/admin/PostManager'
import useAdminSessionStore from '@/app/hooks/auth/admin'
import useAlertStore from '@/app/hooks/store/alert'
import useBlogsStore from '@/app/hooks/store/blog'
import APIClient from '@/app/services/apiClient'
import { EMPTY_BLOGOBJ } from '@/constants'
import { BlogObj, ReqResp } from '@/Interface'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useImmer } from 'use-immer'

interface Props {
      params: Promise<{ id: string }> | undefined;
}

const EditBlogPage = ({ params }: Props) => {


      const [isUploading, setIsUploading] = useState(false);
      const { setModalMessage } = useAlertStore();
      const { saveBlogEdit, blogs } = useBlogsStore();

      const [blogObj, setBlogObj] = useImmer<BlogObj>(EMPTY_BLOGOBJ);
      const { admin } = useAdminSessionStore();

      useEffect(() => {

            (async () => {
                  const d = await params;
                  if (d?.id) {
                        const blog = blogs.find((p) => p._id == d?.id);
                        if (blog) setBlogObj(blog!);
                  }
            })();

      }, [params, blogs, setBlogObj]);


      const handleBlogEdit = async () => {

            setIsUploading(true);

            const resp = await new APIClient<ReqResp & { blog: BlogObj }>('admin/blogs').put({ ...blogObj });
            if (resp.status === "success") {
                  setModalMessage("Blog Successfully Updated");
                  saveBlogEdit(resp.blog);
            } else {
                  setModalMessage(resp.message);
            }

            setIsUploading(false);
      }

      return (

            <div className='w-[98%] mx-auto mt-4'>

                  <div className='my-3 flex justify-between items-center'>
                        <strong className='text-white text-2xl ms-3'>Add Blog</strong>
                        <div className='flex items-center'>
                              {
                                    (admin?.accessLevel === "A" || admin?.accessLevel === "AA" || admin?.accessLevel === "C") &&
                                    <div className='me-7'>
                                          <MediaUploader />
                                    </div>
                              }
                              <Link href="/admin/blogs" className='btn'>Back</Link>
                        </div>

                  </div>

                  <div className="bg-white rounded max-w-[95vw] sm:w-[100%] mx-auto pb-6 sm:pb-12">

                        <PostManager type='Blog' postObj={blogObj} setPostObj={setBlogObj} />

                        <div className='w-full mx-auto text-center pb-12 mt-8'>
                              <button disabled={isUploading} className='btn w-[60%]'
                                    onClick={() => handleBlogEdit()}>
                                    Save Changes
                                    {isUploading && <span className='loading loading-spinner'></span>}
                              </button>
                        </div>
                  </div>

            </div>

      )
}

export default EditBlogPage

