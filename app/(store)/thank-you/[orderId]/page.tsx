import { CURRENCY_SYMBOL } from '@/constants';
import { OrderObj } from '@/Interface';
import { getAuthFromToken } from '@/app/Helper/server';
import Link from 'next/link';
import Order from '@/models/Order'; import { redirect } from 'next/navigation';
import React from 'react'

interface Props {
      params: Promise<{ orderId: string }> | undefined;
}

const ThankYouPage = async ({ params }: Props) => {

      if (!params) return

      const { orderId } = await params;

      const auth = await getAuthFromToken();
      if (!auth) redirect('/account/login');
      const order = await Order.findOne({ orderId, _gid: auth._gid }).lean<OrderObj>();

      if (!order) redirect('/not-found');

      const cancelled = order.status === 'cancelled';
      const outOfStock = cancelled && order.cancelReason === 'out-of-stock-during-payment';
      const pending = order.status === 'pending';
      const creditedAmount = Number(order.balanceCredited || 0).toFixed(2);

      return (
            <div className='w-[90%] sm:w-[70%] lg:w-[55%] mx-auto text-center'>

                  <div className="mt-8">
                        <h1 className='text-2xl'>{cancelled ? 'Order Cancelled ⁉️' : pending ? 'Waiting For Payment Confirmation' : 'Order Confirmed ✅'}</h1>
                  </div>
                  {outOfStock ? <>
                        <div className="mt-6 px-3">
                              <p className="font-bold text-red-600">
                                    Unfortunately your order was cancelled because while making payment 1 or more of the items you ordered went out of stock.
                              </p>
                        </div>
                        <div className="mt-5 px-3">
                              <strong className="text-green-700">
                                    {CURRENCY_SYMBOL}{creditedAmount} Has been credited to your high rollas balance, use this to order again 💚
                              </strong>
                        </div>
                        <Link href="/account/balance" className="mt-5 inline-block font-bold text-blue-600 underline">View Balance</Link>
                        {auth.auth === 'guest' && <p className="mt-4 text-sm">Register using your checkout email to access your credit.</p>}
                  </> : cancelled ? <p className="mt-6 px-3 font-bold text-red-600">Your Order Has Been Cancelled.</p> : !pending && <div className="mt-6 px-3">
                        <strong className="text-[80%]! text-red-600">Email Confirmation Has Been Sent To Your Inbox, If You Can’t Find It Check Your Spam Or Junk Folders</strong>
                  </div>}
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


