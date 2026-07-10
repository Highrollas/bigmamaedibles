'use client'

import AdminProductList from '@/app/components/client/admin/ProductList'
import useAdminSessionStore from '@/app/hooks/auth/admin';
import Link from 'next/link'
import React from 'react'

const AdminProductsPage = () => {

      const admin = useAdminSessionStore(state => state.admin);

      return (
            <div className='w-[98%] mx-auto mt-4'>

                  <div className='my-3 flex justify-between items-center'>
                        <strong className='text-white text-2xl ms-3'>Products</strong>
                        {
                              admin?.accessLevel === "A" || admin?.accessLevel === "AA" && <Link href="/admin/products/add" className='btn'>Add Product</Link>
                        }

                  </div>

                  <AdminProductList />

            </div>
      )
}

export default AdminProductsPage

