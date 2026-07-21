'use client'

import useCartStore from '@/app/hooks/store/cart'
import APIClient from '@/app/services/apiClient'
import { CURRENCY_SYMBOL } from '@/constants';
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface reqResponse {
      status: "success" | "failed";
      message: string;
      transactionObj: {
            paymentStatus: "completed" | "pending" | "cancelled";
            paymentId: string;
            orderId: string;
            amount: string;
            gatewayFee?: string;
            amountPaidUsd?: string;
            amountRequiredUsd?: string;
            balanceCredited?: string;
            paymentLink?: string;
            provider?: string;
      }
}

const OnrampPayment = ({ transactionId }: { transactionId: string }) => {

      const { emptyCart } = useCartStore();
      const [paymentObj, setPaymentObj] = useState({
            paymentStatus: "pending",
            amount: "",
            gatewayFee: "",
            amountPaidUsd: "",
            amountRequiredUsd: "",
            balanceCredited: "",
            orderId: "",
            paymentLink: "",
            provider: "",
      });

      const amount = parseFloat(paymentObj.amount || "0");
      const gatewayFee = parseFloat(paymentObj.gatewayFee || "0");
      const orderTotal = amount.toFixed(2);
      const totalToPay = Number((amount + gatewayFee).toFixed(2));


      const checkPaymentStatus = async () => {
            const resp = await new APIClient<reqResponse>(`transaction?transactionId=${transactionId}`).get();
            if (resp.status === "success") {
                  if (resp.transactionObj.paymentStatus === "completed") {
                        emptyCart();
                        redirect(`/thank-you/${resp.transactionObj.orderId}`);
                  } else {
                        setPaymentObj({
                              paymentStatus: resp.transactionObj.paymentStatus,
                              amount: resp.transactionObj.amount,
                              gatewayFee: resp.transactionObj.gatewayFee || "",
                              amountPaidUsd: resp.transactionObj.amountPaidUsd || "",
                              amountRequiredUsd: resp.transactionObj.amountRequiredUsd || "",
                              balanceCredited: resp.transactionObj.balanceCredited || "",
                              orderId: resp.transactionObj.orderId,
                              paymentLink: resp.transactionObj.paymentLink || "",
                              provider: resp.transactionObj.provider || "hosted",
                        });
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

      if (!paymentObj.orderId) return null;

      return (
            <div className='min-h-screen bg-white px-4 py-6 sm:px-8'>

                  <div className='mx-auto w-full max-w-[1138px] rounded-[18px] bg-[#e21893] p-2 sm:p-5'>

                        <div className='flex flex-wrap items-center justify-center py-2 sm:py-4'>
                              <Image width={350} height={350} alt="Onramp Pay" src="/assets/images/onramp-pay-banner.png" />
                        </div>

                        <div className='relative bg-white px-2 py-8 pb-[70px] text-center sm:px-8 sm:py-9 sm:pb-[120px] rounded-b-[10px]'>

                              <p className='mx-auto text-[14px] font-bold!'>
                                    Pay Using Debit Card And Many Other Methods, Payments Are Processed By A Third Party Company Called Onramp. They Will Charge A Small Fee For Processing The Order, This Is Not Something We Can Control.
                              </p>

                              <div className='mt-8 text-[14px] font-bold! text-red-600'>
                                    Please Watch Tutorial Before Attempting
                              </div>

                              <div className='mt-8 text-[14px] font-bold! text-red-600'>
                                    ID & Selfie Required For First Order
                              </div>

                              {/* <div className='mt-8 text-[85%] font-bold! sm:text-[100%]'>
                                    <div>Order ID: {paymentObj.orderId}</div>
                                    <div className='mt-2'>Order Total: {CURRENCY_SYMBOL}{orderTotal}</div>
                                    {paymentObj.gatewayFee && <div className='mt-2'>Gateway Fee: {CURRENCY_SYMBOL}{paymentObj.gatewayFee}</div>}
                                    <div className='mt-2'>Total To Pay: {CURRENCY_SYMBOL}{totalToPay.toFixed(2)}</div>
                              </div> */}

                              {/* {paymentObj.paymentStatus === "cancelled" && (
                                    <div className='mx-auto mt-8 max-w-[650px] rounded border-[3px] border-red-600 p-4 text-[85%] font-bold! text-red-600'>
                                          <div>Payment Received Was Less Than The Required Order Total.</div>
                                          {paymentObj.balanceCredited && <div className='mt-2'>Balance Credited: {CURRENCY_SYMBOL}{paymentObj.balanceCredited}</div>}
                                          <div className='mt-2'>This Order Was Not Accepted. Please Place A New Order Using Your Account Balance.</div>
                                    </div>
                              )} */}

                              {paymentObj.paymentStatus !== "cancelled" && paymentObj.paymentLink && (
                                    <Link target='_blank' className='absolute bottom-[-1px] right-[-1px] flex p-4 px-7 items-center justify-center rounded-tl-[18px] bg-[#e21893] text-center text-[18px] font-bold! text-white'
                                          href={paymentObj.paymentLink}>
                                          {/* <Image className='h-6 w-6' src='/assets/images/pay-now-icon.png' width={50} height={50} alt='Pay Now' /> */}
                                          <span className='ms-2 font-bold!'>Pay Now</span>
                                    </Link>
                              )}

                              {paymentObj.paymentStatus !== "cancelled" && !paymentObj.paymentLink && (
                                    <div className='mt-8 font-bold! text-red-600 text-[85%]'>Payment Link Is Not Ready. Refresh This Page In A Moment.</div>
                              )}

                              {/* {paymentObj.paymentStatus !== "cancelled" && <div className="mt-10">
                                    <div className='text-[85%]! font-bold!'>Waiting For Payment Confirmation</div>
                                    <div className='mt-4'>
                                          <span className="loading bg-[#e21893] loading-spinner w-10"></span>
                                    </div>
                                    <div className='mt-4 font-bold! text-[85%]! '>Once Payment Is Confirmed This Page Will Reload</div>
                              </div>} */}
                        </div>
                  </div>
            </div>
      )
}

export default OnrampPayment
