
import AdminUserList from '@/app/components/client/admin/UserList'
import Link from 'next/link'
import React from 'react'

const AdminUsersPage = () => {
      return (
            <div className='w-[98%] mx-auto mt-4'>

                  <div className='my-3 flex justify-between items-center'>
                        <strong className='text-white text-2xl ms-3'>Users</strong>
                        <Link href="/admin/products/add" className='btn'>Add User</Link>
                  </div>

                  <AdminUserList />

            </div>
      )
}

export default AdminUsersPage

