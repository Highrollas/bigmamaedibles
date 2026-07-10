import { CURRENCY_SYMBOL } from '@/constants';
import { CheckoutObj } from '@/Interface';
import Order from '@/models/Order'; import { redirect } from 'next/navigation';
import React from 'react'

interface Props {
      params: Promise<{ orderId: string }> | undefined;
}

const ThankYouPage = async ({ params }: Props) => {

      if (!params) return

      const { orderId } = await params;

      const order: CheckoutObj | null = await Order.findOne({ orderId }).lean<CheckoutObj>();

      if (!order) redirect('/not-found');

      return (
            <div className='w-[90%] sm:w-[70%] lg:w-[55%] mx-auto text-center'>

                  <div className="mt-8">
                        <h1 className='text-2xl'>Order Confirmed 🥳 </h1>
                  </div>
                  <div className="mt-6 px-3">
                        <strong className="text-[80%]! text-red-600">Email Confirmation Has Been Sent To Your Inbox, If You Can’t Find It Check Your Spam Or Junk Folders</strong>
                  </div>
                  <div className='mt-5 mb-12'>
                        <div>
                              <div>Order Number</div>
                              <div className='font-bold!'>{orderId}</div>
                        </div>
                        <div className='mt-4'>
                              <div>Date</div>
                              <div className='font-bold!'>{new Date(order.updatedAt!).toDateString()}</div>
                        </div>
                        <div className='mt-4'>
                              <div>Total</div>
                              <div className='font-bold!'>{CURRENCY_SYMBOL}{order.amountTotal}</div>
                        </div>
                        <div className='mt-4'>
                              <div>Payment Method</div>
                              <div className='font-bold!'>{order.paymentGateway?.name}</div>
                        </div>
                  </div>
            </div>
      )
}

export default ThankYouPage


