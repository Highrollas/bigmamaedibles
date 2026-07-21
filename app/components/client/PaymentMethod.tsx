import useCheckoutStore from '@/app/hooks/store/checkout'
import { PAYMENT_METHODS } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'

const PaymentMethod = () => {

      const { checkoutObj, setCheckoutObj } = useCheckoutStore();

      return (

            PAYMENT_METHODS.map((p, i) =>

                  <div key={i} className='flex items-center justify-between mt-5'
                        onClick={() => setCheckoutObj(d => { d.paymentGatewayAlias = p.alias })}>

                        {/* <div className='w-[10%] flex items-center'>
                              <input type="radio" readOnly checked={p.alias === checkoutObj.paymentGatewayAlias} className='h-5 w-5' name='pm-radio-1' />
                        </div> */}


                        <div className="relative border-[3.5px] border-[#e21893] rounded w-[90%]">

                              <div className="bg-[#e21893] max-w-[60%] rounded-br-[5px] text-center flex justify-center h-[32px] items-center">
                                    <Image width={250} height={250} alt="Apple Pay Or Bank Card" src={p.image}
                                          className="w-[80%] sm:w-[50%] max-h-[90%] me-[8px]!" />
                              </div>

                              <div className="p-3">

                                    <div className='font-bold! text-[70%] mb-7'>
                                          {p.details.map((detail, detailIndex) => (
                                                <div key={detailIndex}>- {detail}</div>
                                          ))}
                                    </div>
                                    {/* <div className='font-bold! text-[70%] text-red-600' key={i}>– {p.fee}</div> */}

                                    {p.tutorialLink && (
                                          <Link title={p.name} href={p.tutorialLink}
                                                className="bg-[#e21893] absolute bottom-[-1px] right-[-1px] h-[30px] text-white px-[10px] font-bold! text-[85%] rounded-tl-[5px] flex items-center justify-center">
                                                <Image width={250} height={250} alt='Watch Tutorial' src="/assets/images/watch-tutorial-icon.png"
                                                      className="h-[13px] w-auto me-[8px]!" />
                                                <span className="mt-[3px] font-bold!  text-[80%]">Watch Tutorial</span>
                                          </Link>
                                    )}

                              </div>

                        </div>
                  </div>
            )
      )
}

export default PaymentMethod


