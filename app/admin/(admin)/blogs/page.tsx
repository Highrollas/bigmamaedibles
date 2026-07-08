import AdminBlogList from '@/app/components/client/admin/BlogList'
import Link from 'next/link'
import React from 'react'

const AdminProductsPage = () => {
      return (
            <div className='w-[98%] mx-auto mt-4'>

                  <div className='my-3 flex justify-between items-center'>
                        <strong className='text-white text-2xl ms-3'>Blogs</strong>
                        <Link href="/admin/blogs/add" className='btn'>Add Blog</Link>
                  </div>

                  <AdminBlogList />

            </div>
      )
}

export default AdminProductsPage
