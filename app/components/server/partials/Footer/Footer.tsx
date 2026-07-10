import FallbackImage from '@/app/components/client/FallbackImage'
import Link from 'next/link'

const Footer = () => {
      return (
            <div className='bg-[#e21893] pb-12'>
                  <div className='w-[fit-content] mx-auto py-[30px] text-center'>

                        <div className='flex flex-wrap gap-[35px]'>

                              <div>
                                    <Link href="https://wa.me/447388603709" target="_blank" rel="noopener">
                                          <FallbackImage alt='whatsapp' height={250} width={250} src="/assets/images/whatsapp-icon.png" className='w-[50px]' />
                                    </Link>
                              </div>

                              <div>
                                    <Link href="https://instagram.com/bigmamasedibles.cc?igshid=OGQ5ZDc2ODk2ZA==" target="_blank" rel="noopener">
                                          <FallbackImage alt='instagram' height={250} width={250} src="/assets/images/instagram-icon.png" className='w-[50px]' />
                                    </Link>
                              </div>

                              <div>
                                    <Link href="https://www.reddit.com/r/bigmamasediblesuk/s/nyEXyQQr9y" target="_blank" rel="noopener">
                                          <FallbackImage alt='reddit' height={250} width={250} src="/assets/images/reddit-icon.png" className='w-[50px]' />
                                    </Link>
                              </div>

                              <div>
                                    <Link href="/email-contact-form" rel="noopener">
                                          <FallbackImage alt='Mail' height={250} width={250} src="/assets/images/mail-icon.png" className='w-[50px]' />
                                    </Link>
                              </div>


                        </div>
                  </div>

                  <div className="w-full sm:w-[80%] mx-auto text-white text-center">

                        <div className="flex flex-wrap">

                              <div className="w-[100%] sm:w-[50%] mt-8">
                                    <h2 className='text-2xl sm:text-4xl'>Legal</h2>
                                    <div className="mt-5">
                                          <p className='mt-3'><Link href="/terms-and-conditions">📝 Terms And Conditions</Link></p>
                                          <p className='mt-3'><Link href="/privacy-policy">🕵🏾‍♂ Privacy Policy</Link></p>
                                    </div>
                              </div>


                              <div className="w-[100%] sm:w-[50%] mt-8">
                                    <h2 className='text-2xl sm:text-4xl'>Help</h2>
                                    <div className="mt-5">
                                          <p className='mt-3'><Link href="/faq">🙋🏻‍♂ Frequently Asked Questions</Link></p>
                                          <p className='mt-3'><Link href="/how-to-order">🤷🏻‍♂ How To Order</Link></p>
                                          <p className='mt-3'><Link href="/contact">👩🏼‍💻 Contact Us</Link></p>
                                    </div>
                              </div>
                        </div>

                  </div>


                  <div className="w-full sm:w-[80%] mx-auto text-white text-center mt-12 pb-12">

                        © 2026 - Big Mamas Edibles By High Rolla INC

                  </div>

            </div>
      )
}

export default Footer


