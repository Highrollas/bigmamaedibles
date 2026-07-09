import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const ContactPage = () => {
      return (
            <div className='w-[90%] sm:w-[100%] mx-auto'>

                  <div className="flex justify-center mt-6">
                        <Image src="/assets/images/contact-banner.jpg" className="w-full sm:w-[60%] h-auto" alt="Contact Us" width={500} height={300} />
                  </div>

                  <div className="flex flex-wrap text-center font-[550] mt-6 mb-12">

                        <div className="w-[100%] mt-5 mb-[60px] text-center">
                              <p className="text-[80%] text-center font-bold!">Need To Contact Us Urgently? Use The Links Below</p>
                        </div>


                        <div className="w-[100%] flex items-center justify-center">
                              <Image decoding="async" className='h-[40px]' width={40} height={40} src="/assets/images/whatsapp-icon.png" alt="whatsapp" />
                              <Link className="text-blue-700 font-bold text-[90%] underline ms-2" href="https://wa.me/447388603709" target="_blank" rel="noopener">WhatsApp</Link>
                        </div>


                        <div className="w-[100%] my-12 text-center">
                              <p className='text-[80%] font-bold!'>If The Matter Is Not Urgent , Use The Links Below</p>
                        </div>


                        <div className="w-[50%] flex items-center justify-center">
                              <Image decoding="async" className='h-[40px]' width={40} height={40} src="/assets/images/instagram-icon.png" alt="Instagram" />
                              <Link className="text-blue-700 font-bold text-[90%] underline ms-2" href="https://instagram.com/bigmamasedibles.cc?igshid=OGQ5ZDc2ODk2ZA==" target="_blank" rel="noopener">Instagram</Link>
                        </div>


                        <div className="w-[50%] flex items-center justify-center">
                              <Image decoding="async" className='h-[40px]' width={40} height={40} src="/assets/images/reddit-icon.png" alt="Reddit" />
                              <Link className="text-blue-700 font-bold text-[90%] underline ms-2" href="https://www.reddit.com/r/bigmamasediblesuk/s/nyEXyQQr9y" target="_blank" rel="noopener">Reddit</Link>
                        </div>


                        <div className="w-[100%] flex items-center justify-center mt-8">
                              <Image decoding="async" className='h-[40px]' width={40} height={40} src="/assets/images/mail-icon.png" alt="email" />
                              <Link className="text-blue-700 font-bold text-[90%] underline ms-2" href="/email-contact-form">Email</Link>
                        </div>


                  </div>
            </div>
      )
}

export default ContactPage

