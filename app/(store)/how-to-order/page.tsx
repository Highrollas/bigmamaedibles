import Heading from '@/app/components/server/partials/Heading'
import { paymentMethodTutorial } from '@/constants/payments'
import Image from 'next/image'
import Link from 'next/link'

const HowToOrderPage = () => {

      return (

            <div className='w-[90%] sm:w-[70%] mx-auto'>

                  <Heading>How To Order</Heading>

                  <div className="text-center font-[550] mt-0 mb-5">

                        <div className="w-[100%] mt-5 text-center">
                              <p className="text-[80%] text-center">
                                    Below We Have Created Detailed Tutorial Slides Showing You How To Place Your First Order. First Select Your Preferred Payment Method And Then Click The ‘Watch Tutorial’ Button
                              </p>
                        </div>
                  </div>

                  <div className='mb-12 flex flex-wrap justify-around items-center'>
                        {
                              paymentMethodTutorial.map((p, i) =>

                                    <div key={i} className='mt-5 w-full sm:w-[48%] lg:w-[40%]'>

                                          <div className="relative border-[3.5px] brand-border rounded-[8px]">

                                                {
                                                      p.image && p.image != "" &&
                                                      <div className=" max-w-[45%] rounded-br-[5px] text-center rounded-tl-[8px] bg-white border-[3.5px] border-s-0 border-t-0 brand-border flex justify-center h-[32px] items-center py-1">
                                                            <Image width={250} height={250} alt="Apple Pay Or Bank Card" src={p.image}
                                                                  className="max-w-[80%] w-auto sm:w-[50%] max-h-[90%]" />
                                                      </div>
                                                }

                                                {
                                                      p.imageText && p.imageText != "" &&
                                                      <div className=" max-w-[45%] rounded-br-[5px] text-center rounded-tl-[8px] bg-white border-[3.5px] border-s-0 border-t-0 brand-border flex justify-center h-[32px] items-center py-1">
                                                            <span className="font-bold! text-[80%]">{p.imageText}</span>
                                                      </div>
                                                }

                                                <div className="p-3 gateway-text">

                                                      {p.details.map((d, i) => (
                                                            <div className='font-bold! text-[70%]' key={i} style={{ color: d.color }}>
                                                                  – <span dangerouslySetInnerHTML={{ __html: d.text }} />
                                                            </div>
                                                      ))}
                                                      {/* <div className='font-bold! text-[70%] text-red-600' key={i}>– {p.fee}</div> */}

                                                      {
                                                            p.tutorialLink &&

                                                            <Link title={p.name} href={p.tutorialLink}
                                                                  className="absolute bottom-[-1px] right-[-1px] h-[30px] bg-[#e21893] text-white px-[10px] font-bold! text-[85%] rounded-tl-[5px] flex items-center justify-center">
                                                                  <Image width={250} height={250} alt='Watch Tutorial' src="/assets/images/watch-tutorial-icon.png"
                                                                        className="h-[13px] w-auto me-[8px]!" />
                                                                  <span className="mt-[3px] font-bold!  text-[80%]">Watch Tutorial</span>
                                                            </Link>
                                                      }

                                                </div>

                                          </div>
                                    </div>
                              )
                        }
                  </div>
            </div>
      )
}

export default HowToOrderPage


