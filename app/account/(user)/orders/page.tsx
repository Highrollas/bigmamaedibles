'use client'

import FallbackImage from '@/app/components/client/FallbackImage'
import { formatDateNum, getOrderStatusText, getStatusClass } from '@/app/Helper';
import useSessionStore from '@/app/hooks/auth/user';
import useAlertStore from '@/app/hooks/store/alert';
import APIClient from '@/app/services/apiClient';
import { CURRENCY_SYMBOL } from '@/constants';
import { OrderObj } from '@/Interface';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

interface Resp {
      status: "success" | "failed",
      message: string;
      orders: OrderObj[]
}

const UserOrdersPage = () => {


      const { user } = useSessionStore();
      const { setMessage2 } = useAlertStore();
      const [orders, setOrders] = useState<OrderObj[]>([]);
      const [expandIndex, setExpanIndex] = useState<number | null>(null)

      useEffect(() => {

            new APIClient<Resp>('orders').get().then(resp => {
                  if (resp.status === "success") {
                        setOrders(resp.orders);
                  } else {
                        setMessage2(resp.message, "error");
                  }
            })

      }, []);


      if (!user) return null;

      return (
            <div className='w-[90%] mx-auto'>

                  <div className="flex justify-between mt-10">
                        <Link href='/' className="btn bg-[#e21893] text-white px-3! py-1!">Back</Link>
                  </div>

                  <div className='flex flex-col justify-center items-center mt-5'>
                        <FallbackImage src={'/assets/images/' + user?.avatar + '.png'} alt="user icon" width="100" height="100" />
                        <span className='font-bold mt-2'>@{user?.username}</span>
                  </div>

                  <div className='mt-5'>

                        {
                              <>
                                    <div className="flex text-[80%] font-bold! text-center">
                                          <div className="w-[20%]">Order ID</div>
                                          <div className="w-[25%]">Date</div>
                                          <div className="w-[35%]">Status</div>
                                          <div className='w-[15%]'>Total</div>
                                          <div className='w-[5%]'></div>
                                    </div>

                                    {
                                          orders.map((order, i) =>

                                                <div key={i} onClick={() => expandIndex == i ? setExpanIndex(null) : setExpanIndex(i)} className='border-2 rounded p-3 mt-4 font-[550]! text-[80%] mb-5'>

                                                      <div className=' flex items-center text-center '>
                                                            <div className="w-[20%] text-blue-600">{order.orderId}</div>
                                                            <div className="w-[25%]">{formatDateNum(String(order.createdAt))}</div>
                                                            <div className="w-[35%]">
                                                                  <div className={'bg-red-600 rounded-[5px] mx-auto w-[80%] sm:w-[60%] scale-80 ' + getStatusClass(order.status!)}>
                                                                        {getOrderStatusText(order.status!)}
                                                                  </div>
                                                            </div>
                                                            <div className='w-[15%]'>{CURRENCY_SYMBOL}{order.amountTotal}</div>
                                                            <div className='w-[5%]'>
                                                                  <ChevronDown className={expandIndex === i ? 'hidden' : ''} size={18} />
                                                                  <ChevronUp className={expandIndex === i ? '' : 'hidden'} size={18} />
                                                            </div>
                                                      </div>

                                                      {
                                                            expandIndex == i &&
                                                            <div className="mt-3 text-start font-[550]! text-[90%]">

                                                                  <table id='cartItemsTable' className="table bordered-table table-sm font-bold! mt-5">

                                                                        <thead className='bg-[#e21893] text-white text-center'>
                                                                              <tr>
                                                                                    <th className="w-[20%]">Pic</th>
                                                                                    <th className="w-[55%]">Product</th>
                                                                                    <th className="w-[10%]">Qty</th>
                                                                                    <th className="w-[15%]">£</th>
                                                                              </tr>
                                                                        </thead>
                                                                        <tbody>

                                                                              {
                                                                                    order.cartItems.map((c, i) =>
                                                                                          <tr key={i} className='text-center'>
                                                                                                <td>
                                                                                                      <FallbackImage height={250} width={250} className='w-[60px] h-auto  mx-auto' src={c.productObj.images[0]} alt={c.productObj.name} />
                                                                                                </td>
                                                                                                <td>
                                                                                                      <Link title={c.productObj.name} href={"/product/" + c.productObj.slug}> {c.productObj.name}</Link>

                                                                                                      <div className='text-[80%]'>
                                                                                                            {
                                                                                                                  c.productType == "CheekyDeals" &&
                                                                                                                  c.cheekyVariation!.map((v, i) =>
                                                                                                                        <div className='' key={i}>
                                                                                                                              {
                                                                                                                                    v.selectFields.map((fv, i) =>
                                                                                                                                          <div className='leading-[0.9rem]!' key={i}>
                                                                                                                                                <span className='leading-[0.9rem]!'><b>{v.category}</b>: </span>
                                                                                                                                                <span className='leading-[0.9rem]!'>{fv.value.length > 13 ? fv.value.substring(0, 20 - v.category.length) + '..' : fv.value}</span>
                                                                                                                                          </div>
                                                                                                                                    )
                                                                                                                              }
                                                                                                                        </div>
                                                                                                                  )
                                                                                                            }

                                                                                                            {
                                                                                                                  c.productType == "Bundles" &&
                                                                                                                  c.bundleVariation!.selectFields.map((fv, i) =>
                                                                                                                        <div className='leading-[0.9rem]!' key={i}>
                                                                                                                              <span className='leading-[0.9rem]!'><b>Option{i + 1}</b>: </span>
                                                                                                                              <span className='leading-[0.9rem]!'>{fv.value.length > 13 ? fv.value.substring(0, 20 - c.bundleVariation!.category.length) + '..' : fv.value}</span>
                                                                                                                        </div>
                                                                                                                  )
                                                                                                            }
                                                                                                      </div>

                                                                                                </td>
                                                                                                <td>{c.cartQty}</td>
                                                                                                <td>{CURRENCY_SYMBOL}{c.cartQty * (c.productType === "Bundles" ? c.bundleVariation!.price : c.productObj.price)}</td>
                                                                                          </tr>
                                                                                    )
                                                                              }

                                                                        </tbody>
                                                                  </table>

                                                                  {
                                                                        order.coupons.length > 0 &&
                                                                        <div>
                                                                              <div className="my-2 text-[120%]"><strong>Coupons:</strong></div>
                                                                              {order.coupons.map((c, i) => <div key={i}> {c.code} </div>)}
                                                                        </div>
                                                                  }

                                                                  {
                                                                        parseFloat(order.useBalance) > 0 &&
                                                                        <div>
                                                                              <div className="my-2 text-[120%]"><strong>Balance Used:</strong></div>
                                                                              <div> {CURRENCY_SYMBOL}{order.useBalance} </div>
                                                                        </div>
                                                                  }

                                                                  <div className="my-2 text-[120%]"><strong>Delivery Method:</strong></div>
                                                                  <div> {order.shippingMethod.name} </div>

                                                                  <div className="my-2 text-[120%]"><strong>Delivery Details:</strong></div>
                                                                  <div>
                                                                        {order.billingObj.firstName} {order.billingObj.lastName}<br />
                                                                        {order.billingObj.addressObj.street}<br />
                                                                        {order.billingObj.addressObj.city}{order.billingObj.addressObj.state ? ', ' + order.billingObj.addressObj.state : ''}<br />
                                                                        {order.billingObj.addressObj.postcode}<br />
                                                                        {order.billingObj.addressObj.country}<br />
                                                                  </div>
                                                            </div>
                                                      }

                                                </div>
                                          )
                                    }
                              </>

                        }

                        {
                              orders.length == 0 && <div className='text-center mt-5 border-2 flex justify-center rounded p-3 text-[90%]'> You Have Not Placed An Order Yet. You Knew That So Why Did You Come Here ? 😂</div>
                        }

                  </div>

            </div >
      )
}

export default UserOrdersPage
