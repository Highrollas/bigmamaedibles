import AdminOrdersList from '@/app/components/client/admin/OrderList'
import React from 'react'

const AdminOrdersPage = () => {
      return (
            <div className='w-[98%] mx-auto mt-4'>

                  <div className='my-3 flex justify-between items-center'>
                        <strong className='text-white text-2xl ms-3'>Orders</strong>
                  </div>

                  <AdminOrdersList />

            </div>
      )
}

export default AdminOrdersPage

