'use client'

import useCartStore from '@/app/hooks/store/cart'
import APIClient from '@/app/services/apiClient'
import { CURRENCY_SYMBOL } from '@/constants';
import { ArrowRight } from 'lucide-react';
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
            <div className='min-h-screen bg-white pb-12'>
                  <div className='bg-[#d42d91] px-4 py-2 sm:px-14'>
                        <div className='w-full flex items-center justify-between'>
                              <div className='flex w-full justify-start sm:w-[50%]'>
                                    <Image className='h-auto w-[80px]' width={300} height={220} src='/assets/images/logo-transparent-ed.png' alt='Bigmamasedibles' />
                              </div>

                              <div className='flex w-full justify-end sm:w-[50%] sm:justify-end'>
                                    <Image className='h-[100px] w-auto' width={500} height={360} src='/assets/images/footer-icon.png' alt='Onramp Pay Payment Methods' />
                              </div>
                        </div>
                  </div>

                  <div className='mx-auto w-full max-w-[1120px] px-5 pt-14 sm:pt-18 text-center sm:px-8 sm:py-5 zm'>

                        <p className='mx-auto text-[16px] font-bold!'>
                              Your Secure Onramp Pay Link Has Been Created For This Order. Click The Button Below To Open The Payment Page And Complete Checkout.
                        </p>

                        <div className='mt-10 grid items-start gap-8 sm:mt-14 sm:grid-cols-2 lg:gap-12'>
                              <div className='w-full'>
                                    <div className='mx-auto w-full max-w-[700px] space-y-5 sm:space-y-7 sm:scale-78 lg:scale-90'>
                                          <div className='grid grid-cols-[1fr_28px_1fr] items-center sm:grid-cols-[1fr_44px_1fr] lg:grid-cols-[1fr_64px_1fr]'>
                                                <div className='rounded-[14px] bg-[#e21893] px-2 py-4 text-[17px] font-bold! text-white sm:rounded-[18px] sm:px-3 sm:py-5 sm:text-[18px] lg:px-4 lg:text-[26px]'>Order ID</div>
                                                <div className='h-[6px] bg-[#e21893] sm:h-[8px]'></div>
                                                <div className='rounded-[14px] bg-[#e21893] px-2 py-4 text-[17px] font-bold! text-white sm:rounded-[18px] sm:px-3 sm:py-5 sm:text-[18px] lg:px-4 lg:text-[26px]'>{paymentObj.orderId}</div>
                                          </div>

                                          <div className='grid grid-cols-[1fr_28px_1fr] items-center sm:grid-cols-[1fr_44px_1fr] lg:grid-cols-[1fr_64px_1fr]'>
                                                <div className='rounded-[14px] bg-[#e21893] px-2 py-4 text-[17px] font-bold! text-white sm:rounded-[18px] sm:px-3 sm:py-5 sm:text-[18px] lg:px-4 lg:text-[26px]'>Subtotal</div>
                                                <div className='h-[6px] bg-[#e21893] sm:h-[8px]'></div>
                                                <div className='rounded-[14px] bg-[#e21893] px-2 py-4 text-[17px] font-bold! text-white sm:rounded-[18px] sm:px-3 sm:py-5 sm:text-[18px] lg:px-4 lg:text-[26px]'>{CURRENCY_SYMBOL}{orderTotal}</div>
                                          </div>

                                          <div className='grid grid-cols-[1fr_28px_1fr] items-center sm:grid-cols-[1fr_44px_1fr] lg:grid-cols-[1fr_64px_1fr]'>
                                                <div className='rounded-[14px] bg-[#e21893] px-2 py-4 text-[17px] font-bold! text-white sm:rounded-[18px] sm:px-3 sm:py-5 sm:text-[18px] lg:px-4 lg:text-[26px]'>Onramp Fee</div>
                                                <div className='h-[6px] bg-[#e21893] sm:h-[8px]'></div>
                                                <div className='rounded-[14px] bg-[#e21893] px-2 py-4 text-[17px] font-bold! text-white sm:rounded-[18px] sm:px-3 sm:py-5 sm:text-[18px] lg:px-4 lg:text-[26px]'>{CURRENCY_SYMBOL}{gatewayFee.toFixed(2)}</div>
                                          </div>

                                          <div className='grid grid-cols-[1fr_28px_1fr] items-center sm:grid-cols-[1fr_44px_1fr] lg:grid-cols-[1fr_64px_1fr]'>
                                                <div className='rounded-[14px] bg-[#e21893] px-2 py-4 text-[17px] font-bold! text-white sm:rounded-[18px] sm:px-3 sm:py-5 sm:text-[18px] lg:px-4 lg:text-[26px]'>Total</div>
                                                <div className='h-[6px] bg-[#e21893] sm:h-[8px]'></div>
                                                <div className='rounded-[14px] border-[5px] border-[#e21893] bg-white px-2 py-3 text-[17px] font-bold! text-[#e21893] sm:rounded-[18px] sm:border-[7px] sm:px-3 sm:py-4 sm:text-[18px] lg:px-4 lg:text-[26px]'>{CURRENCY_SYMBOL}{totalToPay.toFixed(2)}</div>
                                          </div>
                                    </div>

                                    {paymentObj.paymentStatus !== "cancelled" && paymentObj.paymentLink && (
                                          <Link target='_blank' className='btn py-7! mt-15 w-full gap-3'
                                                href={paymentObj.paymentLink}>
                                                <span className='font-bold! text-[20px]!'>Open Payment Link</span>
                                                <Image className='h-7 w-auto' alt='arrow right' width={250} height={250} src="/assets/images/pay-arrow.png" />
                                          </Link>
                                    )}

                                    {paymentObj.paymentStatus !== "cancelled" && !paymentObj.paymentLink && (
                                          <div className='mt-8 font-bold! text-red-600 text-[85%]'>Payment Link Is Not Ready. Refresh This Page In A Moment.</div>
                                    )}
                              </div>

                              <div className='flex w-full items-center justify-center mt-6 sm:mt-[15%]'>
                                    {paymentObj.paymentStatus === "cancelled" ? (
                                          <div className='max-w-[430px] text-[85%] font-bold! text-red-600'>
                                                <div>Payment Received Was Less Than The Required Order Total.</div>
                                                {paymentObj.balanceCredited && <div className='mt-2'>Balance Credited: {CURRENCY_SYMBOL}{paymentObj.balanceCredited}</div>}
                                                <div className='mt-2'>This Order Was Not Accepted. Please Place A New Order Using Your Account Balance.</div>
                                          </div>
                                    ) : (
                                          <div>
                                                <div className='text-[18px] font-bold! sm:text-[22px] lg:text-[26px]'>Waiting For Payment Confirmation</div>
                                                <div className='mt-8 sm:mt-12'>
                                                      <span className="loading bg-[#e21893] loading-spinner w-12 sm:w-16"></span>
                                                </div>
                                                <div className='mt-8 font-bold! text-[16px] sm:mt-12 sm:text-[20px] lg:text-[24px]'>Once Payment Is Confirmed This Page Will Reload</div>
                                          </div>
                                    )}
                              </div>
                        </div>
                  </div>
            </div>
      )
}

export default OnrampPayment
