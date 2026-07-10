import AdminPostList from '@/app/components/client/admin/PostList'
import Link from 'next/link'
import React from 'react'

const AdminProductsPage = () => {
      return (
            <div className='w-[98%] mx-auto mt-4'>

                  <div className='my-3 flex justify-between items-center'>
                        <strong className='text-white text-2xl ms-3'>Posts</strong>
                        <Link href="/admin/posts/add" className='btn'>Add Post</Link>
                  </div>

                  <AdminPostList />

            </div>
      )
}

export default AdminProductsPage

