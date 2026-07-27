import FallbackImage from '../client/FallbackImage'
import Link from 'next/link'
import React from 'react'
import AutoScroller from '../client/AutoScroller'



const NotificationMarque = () => {

      const arr = [1, 2, 3, 4, 5, 6, 7];

      return (

            <>
                  <AutoScroller scrollClass='auto-scroll-1' />

                  <div className="bg-[#e21893] flex flex-nowrap items-center whitespace-nowrap text-[80%] mb-[15px] pb-2 overflow-x-scroll auto-scroll-1" style={{ scrollbarWidth: 'none' }}>
                        {arr.map(i =>

                              <React.Fragment key={i}>

                                    <div className="inline-block h-[5px] min-w-[5px] bg-white mx-4"></div>

                                    <div className="inline-block min-w-[fit-content]">
                                          <Link href="/how-to-order" className="flex items-center">
                                                <FallbackImage height={250} width={250} alt='ApplePay' className="h-[17px] w-[auto]" src="/assets/images/how-to-pay.png" />
                                                <span className="font-bold! text-white ms-3">Pay Using Debit Card & More Options</span>
                                          </Link>
                                    </div>

                                    <div className="inline-block h-[5px] min-w-[5px] bg-white mx-4"></div>

                                    <div className="inline-block min-w-[fit-content]">
                                          <div className="flex items-center">
                                                <FallbackImage height={250} width={250} alt='ApplePay' className="h-[25px] w-[auto]" src="/assets/images/delivery-truck.png" />
                                                <span className="font-bold! text-white ms-3">Free Next Day Delivery On Orders Over £100+</span>
                                          </div>
                                    </div>

                                    <div className="inline-block h-[5px] min-w-[5px] bg-white mx-4"></div>

                                    <div className="inline-block min-w-[fit-content]">
                                          <Link target="_blank" href="https://wa.me/447388603709" className="flex items-center">
                                                <FallbackImage height={250} width={250} alt='WhatsApp' className="h-[25px] w-[auto]" src="/assets/images/whatsapp-icon.png" />
                                                <span className="font-bold! text-white ms-3">Contact Us On WhatsApp For Faster Replies</span>
                                          </Link>
                                    </div>

                                    <div className="inline-block h-[5px] min-w-[5px] bg-white mx-4"></div>

                                    <div className="inline-block min-min-w-[fit-content]">
                                          <div className="flex items-center">
                                                <span className="text-[20px]">⏰</span>
                                                <span className="font-bold! text-white ms-3">Order Before 4pm [Mon-Fri] For Next Day Delivery</span>
                                          </div>
                                    </div>

                              </React.Fragment>
                        )}
                  </div >

            </>

      )
}

export default NotificationMarque


