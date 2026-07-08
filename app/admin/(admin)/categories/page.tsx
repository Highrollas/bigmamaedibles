import AdminCategoryList from '@/app/components/client/admin/CategoryList'
import Link from 'next/link'
import React from 'react'

const AdminCategoriesPage = () => {
      return (
            <div className='w-[98%] mx-auto mt-4'>

                  <div className='my-3 flex justify-between items-center'>
                        <strong className='text-white text-2xl ms-3'>Categories</strong>
                        <Link href="/admin/categories/add" className='btn'>Add Catgeory</Link>
                  </div>

                  <AdminCategoryList />

            </div>
      )
}

export default AdminCategoriesPage
