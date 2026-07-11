'use client'

import APIClient from '@/app/services/apiClient'
import { CURRENCY_SYMBOL } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import QRCodeGenerator from './QRCodeGenerator'
import { useEffect, useRef, useState } from 'react'
import { useImmer } from 'use-immer'
import useCartStore from '@/app/hooks/store/cart'
import { copyToClipboard } from '@/app/Helper'

interface reqResponse {
      status: "success" | "failed";
      message: string;
      transactionObj: txObj
}

interface txObj {
      paymentStatus: "completed" | "pending" | "failed";
      paymentId: string;
      orderId: string;
      amountPaid: string;
      amountEur: string,
      address: string;
      amount: string;
      amountCrypto: string;
      createdAt: string;
}

const BchPayment = ({ transactionId, alias }: { transactionId: string; alias: string }) => {

      const [mounted, setMonunted] = useState(false);
      const [countObj, setCountObj] = useImmer({ countDown: "", timeoutWarn: false });
      const [paymentObj, setPaymentObj] = useImmer<txObj>({} as txObj);
      const paymentObjRef = useRef(paymentObj);
      const { emptyCart } = useCartStore();

      const checkPaymentStatus = async () => {
            const resp = await new APIClient<reqResponse>(`transaction?transactionId=${transactionId}`).get();
            if (resp.status === "success") {
                  if (resp.transactionObj.paymentStatus === "completed") {
                        emptyCart();
                        redirect(`/thank-you/${resp.transactionObj.orderId}`);
                  } else {
                        setPaymentObj(resp.transactionObj);
                  }
            }
      }

      const updateCountdown = (countIntv: NodeJS.Timeout, checkIntv: NodeJS.Timeout) => {

            // Get the current time in milliseconds
            const currentTime = new Date().getTime();

            // Convert the createdAt time to milliseconds (assuming it's already in a valid date format)
            const createdAtTime = new Date(paymentObjRef.current.createdAt).getTime();

            const targetTime = createdAtTime + 10800000; // 2 hour in milliseconds
            // Calculate the remaining time in milliseconds
            const remainingTime = targetTime - currentTime;

            if (remainingTime <= 0) {

                  clearInterval(countIntv);
                  clearInterval(checkIntv);

                  setTimeout(() => {
                        redirect('/checkout');
                  }, 2000);

            }

            // Convert the remaining time to minutes and seconds
            const totalMinutes = Math.floor(remainingTime / (1000 * 60));
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

            // Format the minutes and seconds as two-digit numbers (e.g., 05:03)
            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(seconds).padStart(2, '0');
            const hours = parseInt(String(totalMinutes / 60));

            const t = hours + ':' + formattedMinutes + ':' + formattedSeconds;
            const countdownTime = remainingTime < 0 ? '00:00:00' : t;

            // Display the countdown in the element
            setCountObj(d => {
                  d.countDown = countdownTime;
                  d.timeoutWarn = totalMinutes < 15 ? true : false
            });
      }

      useEffect(() => {
            paymentObjRef.current = paymentObj;
      }, [paymentObj]);

      useEffect(() => {

            const checkIntv = setInterval(() => {
                  checkPaymentStatus();
            }, 60000);

            //make this request on mounted
            checkPaymentStatus();

            const countIntv = setInterval(() => {
                  updateCountdown(countIntv, checkIntv);
            }, 1000);

            setMonunted(true);

            return () => { clearInterval(checkIntv); clearInterval(countIntv) };

      }, []);

      if (!mounted || !paymentObj.orderId) return null

      return (

            <div className='sm:scale-70 sm:pt-10'>
                  <div className='w-[95%] sm:w-[65%] lg:w-[40%] mx-auto sm:shadow-2xl sm:p-5 sm:mt-[-130px] sm:rounded-2xl'>

                        {/* <div className="mt-3 mt-sm-5 mb-3 text-center">
                              <Image width={250} height={200} className='w-full' src="/assets/images/text-logo.png" alt="img" />
                        </div> */}

                        <div className='bg-[#0ac18e] flex justify-between text-white px-5 py-1 mt-3 mt-sm-5 mb-3'>

                              <div>
                                    {
                                          countObj.countDown === "00:00:00"
                                                ? <span className='font-bold!'>Payment Failed</span>
                                                : <div className='flex'>
                                                      <div className='loading mr-2 w-5'></div>
                                                      <span>Awaiting Payment...</span>
                                                </div>
                                    }
                              </div>

                              <div className={countObj.timeoutWarn ? 'text-red-600 font-bold!' : ''} >{countObj.countDown}</div>
                        </div>

                        <div className='flex justify-between items-center py-3 px-4'>
                              <div className='font-[550]!'> Pay With </div>
                              <div className='flex items-center'>
                                    <div>
                                          <Image src='/assets/images/bch-logo.png' alt='bch logo' height={36} width={36} />
                                    </div>
                                    <span className='font-[550]! ms-2'>Bitcoin Cash</span>
                              </div>
                        </div>

                        <hr className='border-[#0ac18e] border-[1.5px]' />

                        {
                              countObj.countDown === "00:00:00" ?

                                    <div className="p-3 text-center mt-12">

                                          <svg className='mx-auto' xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="red"
                                                viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                <path
                                                      d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                          </svg>

                                          <p className="mt-5"><strong> Payment Timeout : Failed </strong></p>
                                          <p>Redirecting To Bigmamasedibles... </p>

                                    </div>

                                    :

                                    <>
                                          <div className='h-[200px] flex justify-center items-center'>
                                                <QRCodeGenerator text={paymentObj.address} />
                                          </div>

                                          <div className='flex justify-between bg-[#0ac18e] items-center p-3'>
                                                <div className='w-[20%]'>
                                                      <button className='btn bg-[#e21893] text-white py-0! px-4! text-[80%]! brand-border scale-70'
                                                            onClick={() => copyToClipboard(paymentObj.address, "Address Copied")}>Copy</button>
                                                </div>
                                                <div className='w-[80%] text-[75%] text-center text-black'>
                                                      {paymentObj.address}
                                                </div>
                                          </div>

                                          <div className='flex justify-between items-center py-3 px-4'>
                                                <div className='font-[550]!'> Amount Due </div>
                                                <div className='flex items-center'>
                                                      <div className='ms-2'>
                                                            <div className='font-[550]!'>
                                                                  <button className='btn bg-[#e21893] text-white py-0! px-4! text-[80%]! brand-border scale-70'
                                                                        onClick={() => copyToClipboard(paymentObj.amountCrypto, "Amount Copied")}>
                                                                        Copy
                                                                  </button>
                                                                  <span className='text-red-600'>{paymentObj.amountCrypto}</span> <span>BCH</span>
                                                            </div>
                                                            <div className='text-end italic text-[80%]! mt-[-6px]'>
                                                                  = {CURRENCY_SYMBOL}{paymentObj.amount}
                                                            </div>
                                                      </div>
                                                </div>
                                          </div>

                                          <hr className='border-[#0ac18e] border-[1.5px]' />

                                          <div className="px-3 p-4 text-start rounded text-white my-4 bg-red-600">

                                                <p className="mb-3 font-[550]! text-[80%] mt-2 leading-[20px]!">
                                                      <strong className='text-[180%]!'>- </strong>
                                                      The Crypto App You Use May Charge You A Fee To Pay For This Order. Its
                                                      Your Responsibility To Cover These Fees Separately To The Amount We Have Requested Above.
                                                </p>
                                                <p className="mb-3 font-[550]! text-[80%] leading-[20px]! mt-2">
                                                      <strong className='text-[180%]!'>- </strong>
                                                      Please Send The Exact Amount Displayed Above To Avoid Any Interruptions
                                                </p>
                                                <p className="mb-3 font-[550]! text-[80%] leading-[20px]! mt-2">
                                                      <strong className='text-[180%]!'>- </strong>
                                                      Only Send Bitcoin Cash [BCH] To The Above Wallet Address
                                                </p>
                                                <p className="mb-3 font-[550]! text-[80%] leading-[20px]! mt-2">
                                                      <strong className='text-[180%]!'>- </strong>
                                                      Its Best To Wait For This Page To Refresh.
                                                      This Will Happen Once Your Payment Is Received.
                                                      It usually Takes 20-30 Minutes For Our System To
                                                      Recognise Your Payment. This System Is Automated
                                                      So If You Do Close This Page By Accident,
                                                      The Order Will Still Go Through As Long
                                                      As Payment Is Received.
                                                </p>
                                          </div>

                                          {alias == "moonpay" &&

                                                <>
                                                      <hr className='border-[#0ac18e] border-[1.5px]' />
                                                      <div className="p-2 mt-2 text-center">

                                                            <div className="col-11 m-auto mt-4">

                                                                  <h2 className='text-2xl'>Do You Need Help?</h2>

                                                            </div>

                                                            <div className="mt-5 small-2 mb-3 text-[70%] font-bold! leading-[20px]!">
                                                                  We Use An App Called Moonpay To Help Customers Pay For Orders
                                                                  Using Applepay Or Bank Card. To Learn How To Pay For
                                                                  This Order Using Moonpay, Click The Button Below
                                                            </div>

                                                            <div className="col-8 m-auto mt-7">
                                                                  <Link target="_blank" href="/pay-using-moonpay">
                                                                        <Image height={250} width={250} className='mx-auto' src="/assets/images/moonpay-logo.png" alt="moonpay" />
                                                                  </Link>
                                                            </div>

                                                            <div className="mt-7  mb-3 text-[70%] font-bold! leading-[20px]!">
                                                                  We understand This Is Not Your Normal Way Of Paying
                                                                  For Goods Online But You Need To Remember That
                                                                  Cannabis Is Still Illegal In The UK. This Means We
                                                                  Have To Find Solutions That Are Not Always Easy Or
                                                                  Conventional. This Payment Method Helps Us To Protect
                                                                  Ourselves And Keep Our Services Running Without Any
                                                                  Interruptions. Thankyou For Your Understanding.
                                                            </div>

                                                      </div>
                                                </>
                                          }

                                          <hr className='brand-border border-[1.5px]' />

                                          <div className="px-4">
                                                <p className="mt-4 text-[70%] text-center font-bold! leading-[20px]!">This Payment Gateway Is Soley Owned And Controlled ByBig Mama Edibles 2023-<span> <script type="text/javascript"> document.write(new Date().getFullYear()) </script>2026</span></p>
                                          </div>
                                    </>
                        }

                  </div>
            </div>


      )
}

export default BchPayment


