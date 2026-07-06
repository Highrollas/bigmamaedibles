'use client'

import useCartStore from '@/app/hooks/store/cart'
import APIClient from '@/app/services/apiClient'
import { ChevronUp, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface reqResponse {
      status: "success" | "failed";
      message: string;
      transactionObj: {
            paymentStatus: "completed" | "pending";
            paymentId: string;
            orderId: string;
            amountEur: string,
            address: string;
            // amountUsd: string;
      }
}

const WertPayment = ({ transactionId }: { transactionId: string }) => {

      const [showMore, setShowMore] = useState(false);
      const { emptyCart } = useCartStore();
      const [paymentObj, setPaymentObj] = useState({ amountEur: "0", address: "" });

      const checkPaymentStatus = async () => {
            const resp = await new APIClient<reqResponse>(`transaction?transactionId=${transactionId}`).get();
            if (resp.status === "success") {
                  if (resp.transactionObj.paymentStatus === "completed") {
                        emptyCart();
                        redirect(`/thank-you/${resp.transactionObj.orderId}`);
                  } else {
                        setPaymentObj({ amountEur: resp.transactionObj.amountEur, address: resp.transactionObj.address });
                  }

            }
      }

      useEffect(() => {

            const intervalId = setInterval(() => {
                  checkPaymentStatus();
            }, 30000);

            checkPaymentStatus();

            return () => clearInterval(intervalId);

      }, []);

      if (paymentObj.address == "") return null;

      return (
            <div>
                  <div className='h-30 brand-panel w-full flex items-center justify-between'>
                        <div className='w-[60%]'>
                              <Image width={250} height={200} src='/assets/images/hero-logo.png' alt='Bigmamasedibles' />
                        </div>
                        <div className='w-[50%]'>
                              <Image width={150} height={150} src='/assets/images/wert-pay-icon.png' className='mx-auto' alt='Wert' />
                        </div>
                  </div>

                  <div className='p-6 sm:w-[50%] mx-auto'>

                        <p className='font-bold! text-center text-[85%]'>
                              After Clicking The ‘Pay Now’ Button You Will Be Redirected
                              To A Link That Was Specifically Created For This Order.
                              Please Watch The Tutorial Video Before Attempting To Pay.
                        </p>

                        <div onClick={() => setShowMore(!showMore)} className="border-red-600 border-3 rounded p-2 mt-5">
                              <div className='text-red-600 text-center text-[80%] font-bold! leading-[20px]!'>
                                    Some Banks May Decline Your Payment As It
                                    Is Associated With Cryptocurrency.
                                    We Have Created A List Of Crypto
                                    Friendly And Unfriendly Banks Below

                                    <ChevronUp className={showMore ? 'inline text-black' : 'hidden'} />
                                    <ChevronDown className={showMore ? 'hidden' : 'inline text-black'} />

                                    <div className={showMore ? '' : 'hidden'}>

                                          <div className='text-[#0ed145] mt-4'>
                                                <strong className='text-3xl'>Green List</strong>
                                                <div className="text-[90%] font-bold! mt-1">The Banks Below Are Likely To Accept Your Transaction</div>
                                                <Image src='/assets/images/green-banks.png' className='mt-2 mx-auto' width={500} height={500} alt='Green Banks' />
                                          </div>

                                          <div className='text-red-600 mt-6'>
                                                <strong className='text-3xl'>Red List</strong>
                                                <div className="text-[90%] font-bold! mt-1">The Banks Below Are Unlikely To Allow Your Transaction</div>
                                                <Image src='/assets/images/red-banks.png' className='mt-2 mx-auto' width={500} height={500} alt='Red Banks' />
                                          </div>

                                    </div>

                              </div>
                        </div>

                        <div className='mt-6 flex justify-between sm:justify-around'>
                              <Link className='btn brand-panel text-white flex items-center justify-center p-7 rounded'
                                    href='/pay-using-apple-pay-or-bank-card'>
                                    <Image className='h-5 w-4' src='/assets/images/watch-tutorial-icon.png' width={50} height={50} alt='Play Tutorial' />
                                    <span className='ms-2 font-bold!'> Watch Tutorial</span>
                              </Link>
                              <Link target='_blank' className='btn brand-panel text-white flex items-center justify-center p-7 rounded'
                                    href={'https://widget.wert.io/01HCKZD4AEX5VG0ETTAXRB31H3/widget/login?commodity=USDT&network=polygon&currency_amount=' + paymentObj.amountEur + '&commodities=%5B%7B%22commodity%22%3A%22USDT%22,%22network%22%3A%22polygon%22%7D%5D&currency=EUR&address=' + paymentObj.address + ' &commodity_id=usdt.erc-20.polygon'}>
                                    <Image className='h-6 w-6' src='/assets/images/pay-now-icon.png' width={50} height={50} alt='Play Tutorial' />
                                    <span className='ms-2 font-bold!'> Pay Now</span>
                              </Link>
                        </div>

                        <div className="mt-12 text-center">
                              <div className='text-[85%]! font-bold!'>Waiting For Payment</div>
                              <div className='mt-5'>
                                    <span className="loading loading-spinner w-14"></span>
                              </div>
                              <div className='mt-5 font-bold! text-[85%]! '>Once Payment Is Made This Page Will Reload</div>
                        </div>

                  </div>


            </div>
      )
}

export default WertPayment

