import React from 'react'
import Link from 'next/link'
import AppHeader from '../components/server/partials/AppHeader'
import Footer from '../components/server/partials/Footer/Footer'

const NotFound = () => {
      return (
            <div>
                  <AppHeader />
                  <div className="w-[80%] mx-auto pt-[40px] pb-[90px] text-center">
                        <h2 className='text-2xl mb-5'>404 Not Found</h2>
                        <div>Opps The Page Or Item You Are Looking For Could Not Be Found At The Moment</div>
                        <div className='mt-5'>
                              <Link href='/' className='btn brand-panel text-white w-[140px]'>Home</Link>
                        </div>
                  </div>
                  <Footer />
            </div>
      )
}

export default NotFound

