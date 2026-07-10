'use client'

import { ChevronLeft } from 'lucide-react';
import PostManager from '@/app/components/client/admin/PostManager'
import useAlertStore from '@/app/hooks/store/alert'
import usePostsStore from '@/app/hooks/store/post'
import APIClient from '@/app/services/apiClient'
import { EMPTY_POSTBJ } from '@/constants'
import { PostObj, ReqResp } from '@/Interface'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useImmer } from 'use-immer'

interface Props {
      params: Promise<{ id: string }> | undefined;
}

const EditPostPage = ({ params }: Props) => {


      const [isUploading, setIsUploading] = useState(false);
      const { setModalMessage } = useAlertStore();
      const { savePostEdit, posts } = usePostsStore();

      const [postObj, setPostObj] = useImmer<PostObj>(EMPTY_POSTBJ);


      useEffect(() => {

            (async () => {
                  const d = await params;
                  if (d?.id) {
                        const post = posts.find((p) => p._id == d?.id);
                        if (post) setPostObj(post!);
                  }
            })();

      }, [params, posts, setPostObj]);


      const handlePostEdit = async () => {

            setIsUploading(true);

            const resp = await new APIClient<ReqResp & { post: PostObj }>('admin/posts').put({ ...postObj });
            if (resp.status === "success") {
                  setModalMessage("Post Successfully Updated");
                  savePostEdit(resp.post);
            } else {
                  setModalMessage(resp.message);
            }

            setIsUploading(false);
      }

      return (

            <div className='w-[98%] mx-auto mt-4'>

                  <div className='my-3 flex justify-between items-center'>
                        <strong className='text-white text-2xl ms-3'>Add Post</strong>
                        <Link href="/admin/posts" className='btn'> <ChevronLeft className='mr-[1px]' size={20} color='white' /></Link>
                  </div>

                  <div className="bg-white rounded max-w-[95vw] sm:w-[100%] mx-auto pb-6 sm:pb-12">

                        <PostManager type='Post' postObj={postObj} setPostObj={setPostObj} />

                        <div className='w-full mx-auto text-center pb-12 mt-8'>
                              <button disabled={isUploading} className='btn w-[60%]'
                                    onClick={() => handlePostEdit()}>
                                    Save Changes
                                    {isUploading && <span className='loading loading-spinner'></span>}
                              </button>
                        </div>
                  </div>

            </div>

      )
}

export default EditPostPage


