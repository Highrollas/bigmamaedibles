'use client'
import MediaUploader from '@/app/components/client/admin/MediaUploader'
import PostManager from '@/app/components/client/admin/PostManager'
import useAdminSessionStore from '@/app/hooks/auth/admin'
import useAlertStore from '@/app/hooks/store/alert'
import usePostsStore from '@/app/hooks/store/post'
import APIClient from '@/app/services/apiClient'
import { EMPTY_BLOGOBJ } from '@/constants'
import { ReqResp, PostObj } from '@/Interface'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useImmer } from 'use-immer'

interface Props {
      params: Promise<{ id: string }> | undefined;
}

const AddBlogPostCopyPage = ({ params }: Props) => {


      const [isUploading, setIsUploading] = useState(false);
      const { setModalMessage } = useAlertStore();
      const { pushPost, posts } = usePostsStore();

      const [postObj, setPostObj] = useImmer<PostObj>(EMPTY_BLOGOBJ);

      const { admin } = useAdminSessionStore();

      useEffect(() => {

            (async () => {
                  const d = await params;
                  if (d?.id) {
                        const post = posts.find((p) => p._id == d?.id);
                        if (post) setPostObj(post!);
                  }
            })();

      }, [params, posts, setPostObj]);

      const handlePostUpload = async () => {

            setIsUploading(true);
            const resp = await new APIClient<ReqResp & { post: PostObj }>('admin/blogs').post({ ...postObj });
            if (resp.status === "success") {
                  setModalMessage("Post Successfully Uploaded");
                  pushPost(resp.post);
                  setPostObj(EMPTY_BLOGOBJ);
            } else {
                  setModalMessage(resp.message);
            }

            setIsUploading(false);
      }

      return (

            <div className='w-[98%] mx-auto mt-4'>

                  <div className='my-3 flex justify-between items-center'>
                        <strong className='text-white text-2xl ms-3'>Add Post</strong>
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

                  <div className="bg-white rounded max-w-[95vw] sm:w-[100%] mx-auto mb-6 sm:mb-12">

                        <PostManager type='Blog' postObj={postObj} setPostObj={setPostObj} />

                        <div className='w-full mx-auto text-center pb-12 mt-8'>
                              <button disabled={isUploading} className='btn w-[60%]'
                                    onClick={() => handlePostUpload()}>
                                    Add Blog Post
                                    {isUploading && <span className='loading loading-spinner'></span>}
                              </button>
                        </div>
                  </div>

            </div>

      )
}

export default AddBlogPostCopyPage

