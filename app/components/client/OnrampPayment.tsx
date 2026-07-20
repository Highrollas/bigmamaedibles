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
            <div>
                  <div className='h-30 bg-[#e21893] w-full flex items-center justify-between'>
                        <div className='w-50%] ps-6'>
                              <Image className='h-20 w-20' width={250} height={200} src='/assets/images/logo.png' alt='Bigmamasedibles' />
                        </div>
                        <div className='w-[50%] flex items-center gap-1.5 text-white justify-end pe-7 font-bold!'>
                              <Image className='h-8 w-15' width={250} height={200} src='/assets/images/onramp-pay.png' alt='Onramp Pay' />
                              Onramp Pay
                        </div>
                  </div>

                  <div className='p-6 sm:w-[50%] mx-auto text-center'>
                        <p className='font-bold! text-[85%]'>
                              Your Secure Onramp Pay Link Has Been Created For This Order.
                              Click The Button Below To Open The Payment Page And Complete Checkout.
                        </p>

                        <div className='mt-6 rounded-[5px] border-[3px] border-[#e21893] p-4 text-[85%] font-bold!'>
                              <div>Order ID: {paymentObj.orderId}</div>
                              {paymentObj.gatewayFee && <div className='mt-2'>Fee: {CURRENCY_SYMBOL}{paymentObj.gatewayFee}</div>}
                              <div className='mt-2'>Total: {CURRENCY_SYMBOL}{paymentObj.amount}</div>
                        </div>

                        {paymentObj.paymentStatus === "cancelled" && (
                              <div className='mt-6 rounded border-[3px] border-red-600 p-4 text-[85%] font-bold! text-red-600'>
                                    <div>Payment Received Was Less Than The Required Order Total.</div>
                                    {paymentObj.balanceCredited && <div className='mt-2'>Balance Credited: {CURRENCY_SYMBOL}{paymentObj.balanceCredited}</div>}
                                    <div className='mt-2'>This Order Was Not Accepted. Please Place A New Order Using Your Account Balance.</div>
                              </div>
                        )}

                        {paymentObj.paymentStatus !== "cancelled" && <div className='mt-6'>
                              {paymentObj.paymentLink ? (
                                    <Link target='_blank' className='btn bg-[#e21893] text-white flex items-center justify-center p-7 rounded w-full'
                                          href={paymentObj.paymentLink}>
                                          <Image className='h-6 w-6' src='/assets/images/pay-now-icon.png' width={50} height={50} alt='Pay Now' />
                                          <span className='ms-2 font-bold!'>Open Payment Link</span>
                                    </Link>
                              ) : (
                                    <div className='font-bold! text-red-600 text-[85%]'>Payment Link Is Not Ready. Refresh This Page In A Moment.</div>
                              )}
                        </div>}

                        {paymentObj.paymentStatus !== "cancelled" && <div className="mt-12">
                              <div className='text-[85%]! font-bold!'>Waiting For Payment Confirmation</div>
                              <div className='mt-5'>
                                    <span className="loading bg-[#e21893] loading-spinner w-14"></span>
                              </div>
                              <div className='mt-5 font-bold! text-[85%]! '>Once Payment Is Confirmed This Page Will Reload</div>
                        </div>}
                  </div>
            </div>
      )
}

export default OnrampPayment
