'use client'
import PostManager from '@/app/components/client/admin/PostManager'
import useAlertStore from '@/app/hooks/store/alert'
import usePostsStore from '@/app/hooks/store/post'
import APIClient from '@/app/services/apiClient'
import { EMPTY_POSTBJ } from '@/constants'
import { ReqResp, PostObj } from '@/Interface'
import Link from 'next/link'
import React, { useState } from 'react'
import { useImmer } from 'use-immer'

const AddPostPage = () => {


      const [isUploading, setIsUploading] = useState(false);
      const { setModalMessage } = useAlertStore();
      const { pushPost } = usePostsStore();

      const [postObj, setPostObj] = useImmer<PostObj>(EMPTY_POSTBJ);

      const handlePostUpload = async () => {

            setIsUploading(true);
            const resp = await new APIClient<ReqResp & { post: PostObj }>('admin/posts').post({ ...postObj });
            if (resp.status === "success") {
                  setModalMessage("Post Successfully Uploaded");
                  pushPost(resp.post);
                  setPostObj(EMPTY_POSTBJ);
            } else {
                  setModalMessage(resp.message);
            }

            setIsUploading(false);
      }

      return (

            <div className='w-[98%] mx-auto mt-4'>

                  <div className='my-3 flex justify-between items-center'>
                        <strong className='text-white text-2xl ms-3'>Add Post</strong>
                        <Link href="/admin/posts" className='btn'>Back</Link>
                  </div>

                  <div className="bg-white rounded max-w-[95vw] sm:w-[100%] mx-auto mb-6 sm:mb-12">

                        <PostManager type='Post' postObj={postObj} setPostObj={setPostObj} />

                        <div className='w-full mx-auto text-center pb-12 mt-8'>
                              <button disabled={isUploading} className='btn w-[60%]'
                                    onClick={() => handlePostUpload()}>
                                    Add Post
                                    {isUploading && <span className='loading loading-spinner'></span>}
                              </button>
                        </div>
                  </div>

            </div>

      )
}

export default AddPostPage

