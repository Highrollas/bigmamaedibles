import Heading from '@/app/components/server/partials/Heading'
import { PAYMENT_METHODS } from '@/constants'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React from 'react'

const HowToPayWithApplePayOrBankCard = () => {

      const gatewayObj = PAYMENT_METHODS.find(p => p.alias === "wert");

      if (gatewayObj == null) return redirect('/not-found');

      return (

            <div className='w-[90%] sm:w-[80%] lg:w-[60%] mx-auto mb-12'>

                  <div className="mt-12">
                        <Heading> Pay Using Apple Pay Or Bank Card </Heading>
                  </div>

                  <div className='mt-12'>
                        <video controls className='w-full h-[300px]'
                              poster='/assets/images/pay-by-apple-pay-or-bank-card-video-preview-image.png'
                              src="/assets/videos/pay-by-card-vid.mp4?v=1"></video>
                  </div>

                  <div className='mt-12'>

                        <div className="relative border-[3.5px] border-[#e21893] rounded">

                              <div className="max-w-[60%] rounded-br-[5px] text-center brand-panel flex justify-center h-[32px] items-center">
                                    <Image width={250} height={250} alt="Apple Pay Or Bank Card" src={gatewayObj.image}
                                          className="w-[80%] sm:w-[50%] max-h-[90%] me-[8px]!" />
                              </div>

                              <div className="p-3 gateway-text">

                                    {gatewayObj.details.map((d, i) => <div className='font-bold! text-[70%]' key={i}>– {d}</div>)}
                                    <div className='font-bold! text-[70%] text-red-600'>– {gatewayObj.fee}</div>
                              </div>

                        </div>
                  </div>

            </div>
      )
}

export default HowToPayWithApplePayOrBankCard


