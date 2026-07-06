import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import OnHoldOrderCount from '../../client/admin/OnHoldOrderCount'
import MediaUploader from '../../client/admin/MediaUploader'
import useAdminSessionStore from '@/app/hooks/auth/admin'

const AdminNav = () => {

      const { admin } = useAdminSessionStore()


      return (

            <div>
                  <div className="navbar bg-base-100 shadow-sm py-6 px-12 border-b-2 sm:w-[98%] mx-auto sm:mt-2 rounded">

                        <div className="w-full flex justify-between items-center">

                              <div className="flex items-center justify-center">
                                    <Image src="/assets/images/logo.png" alt='Logo' className='h-15 w-15 rounded' width={250} height={250} />
                              </div>

                              <div className='flex items-center scale-93'>


                                    {
                                          (admin?.accessLevel === "A" || admin?.accessLevel === "AA" || admin?.accessLevel === "C") &&
                                          <div className='me-7'>
                                                <MediaUploader />
                                          </div>
                                    }

                                    {
                                          (admin?.accessLevel === "A" || admin?.accessLevel === "AA") &&

                                          <div>
                                                <div tabIndex={0} role="button" className="btn-ghost btn-circle pe-10">
                                                      <Link href="/admin/orders" className="indicator mt-3">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> </svg>
                                                            <OnHoldOrderCount />
                                                      </Link>
                                                </div>
                                          </div>

                                    }

                                    <div className="dropdown dropdown-end">
                                          <div tabIndex={0} role="button" className="btn-ghost btn-circle avatar">
                                                <div className="w-10 rounded-full border-red-600">
                                                      <Image
                                                            alt="Admin"
                                                            src="/assets/images/admin-image.png" width={250} height={250} />
                                                </div>
                                          </div>
                                          <ul
                                                tabIndex={0}
                                                className="menu menu-sm dropdown-content hidden sm:block bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                                                <li><a>Settings</a></li>
                                                <li><a>Logout</a></li>
                                          </ul>
                                    </div>

                              </div>

                        </div>
                  </div>
            </div>
      )
}

export default AdminNav

