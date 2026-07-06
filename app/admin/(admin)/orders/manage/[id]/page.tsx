"use client";

import useOrdersStore from '@/app/hooks/store/order';
import { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import Link from 'next/link';
import { OrderObj, orderStatus, ReqResp } from '@/Interface';
import { Pencil, Printer, X } from 'lucide-react';
import Image from 'next/image';
import { printShippingLabels } from '@/app/Helper';
import APIClient from '@/app/services/apiClient';
import useAlertStore from '@/app/hooks/store/alert';
import useAdminSessionStore from '@/app/hooks/auth/admin';

interface Props {
      params: Promise<{ id: string }> | undefined;
}

const AdminManageOrderPage = ({ params }: Props) => {

      const { orders, saveOrderEdit } = useOrdersStore();
      const [orderObj, setOrderObj] = useImmer({} as OrderObj);
      const [editBilling, setEditBilling] = useState(false);
      const [loading, setLoading] = useState(false);
      const { setModalMessage } = useAlertStore();
      const { admin } = useAdminSessionStore();


      useEffect(() => {
            (async () => {
                  const d = await params;
                  if (d?.id) {
                        const order = orders.find((o) => o._id === d.id);
                        if (order) setOrderObj(order);
                  }
            })();
      }, [params, orders, setOrderObj]);

      const handleOrderEdit = async () => {

            setLoading(true);

            const resp = await new APIClient<ReqResp & { order: OrderObj }>('admin/orders').put({ ...orderObj });
            if (resp.status === "success") {
                  setModalMessage("Order Successfully Updated");
                  saveOrderEdit(resp.order);
            } else {
                  setModalMessage(resp.message);
            }

            setLoading(false);
      }


      if (Object.keys(orderObj).length == 0) return (
            < div className='w-[90%] p-4 flex justify-center items-center h-[100px] rounded mx-auto bg-white mt-10'>
                  <span className="loading loading-spinner w-5 h-5 brand-border"></span>
            </div>
      )


      return (

            <div className='w-[98%] mx-auto mt-4'>

                  <div className='my-3 flex justify-between items-center'>
                        <strong className='text-white text-2xl ms-3'>Manage Order</strong>
                        <Link href="/admin/orders" className='btn'>Add Product</Link>
                  </div>

                  <div className="bg-white rounded max-w-[95vw] sm:w-[100%] mx-auto pb-6 sm:pb-6">

                        <div className='p-5'>

                              <div className='flex flex-wrap gap-3 justify-between'>

                                    <div className="w-full">
                                          <strong className='text-2xl'> Order {orderObj.orderId} Details </strong>
                                          <p className='text-black/50'> Payment via {orderObj.paymentGateway.name}</p>
                                    </div>

                                    <div className='w-[30%] mt-4'>

                                          <div><strong>Genral</strong></div>

                                          <div className='w-full mt-4'>
                                                <label htmlFor="" className='text-muted'>Order Status</label>
                                                <select className="select w-full"
                                                      value={orderObj.status}
                                                      onChange={(e) => setOrderObj(d => { d.status = e.target.value as orderStatus })}>
                                                      <option value="on-hold">Preparing</option>
                                                      <option value="processing">Shipped</option>
                                                      <option value="completed">Delivered</option>
                                                      <option value="pending">Pending</option>
                                                      <option value="cancelled">Cancelled</option>
                                                </select>
                                          </div>

                                          <div className='mt-12 w-full'>
                                                <button className='btn' onClick={() => handleOrderEdit()}>
                                                      Save Changes
                                                      {loading && <span className='loading loading-spinner'></span>}
                                                </button>
                                          </div>

                                    </div>

                                    <div className='w-[30%] mt-4 relative'>

                                          <div><strong>Delivery Address</strong></div>

                                          <div className='w-full mt-4 text-[90%]'>

                                                {!editBilling ?

                                                      <div>
                                                            <p className='text-muted'>{orderObj.billingObj.firstName} {orderObj.billingObj.lastName}</p>
                                                            <p className='text-muted'>{orderObj.billingObj.addressObj.street}</p>
                                                            <p className='text-muted'>{orderObj.billingObj.addressObj.city} {orderObj.billingObj.addressObj.state} </p>
                                                            <p className='text-muted'>{orderObj.billingObj.addressObj.postcode} </p>
                                                            <p className='text-muted'>{orderObj.billingObj.addressObj.country} </p>
                                                            <div className='mt-2'><strong>Email</strong></div>
                                                            <p className='underline text-blue-600'>{orderObj.billingObj.email} </p>
                                                      </div>

                                                      :

                                                      <div className='flex flex-wrap justify-between'>
                                                            <div className='w-[45%]'>
                                                                  <label htmlFor="">First Name</label>
                                                                  <input type="text" className='input w-full'
                                                                        value={orderObj.billingObj.firstName}
                                                                        onChange={(e) => setOrderObj(d => { d.billingObj.firstName = e.target.value })} />
                                                            </div>

                                                            <div className='mt-2 w-[45%]'>
                                                                  <label htmlFor="">Last Name</label>
                                                                  <input type="text" className='input w-full'
                                                                        value={orderObj.billingObj.lastName}
                                                                        onChange={(e) => setOrderObj(d => { d.billingObj.lastName = e.target.value })} />
                                                            </div>

                                                            <div className='mt-2 w-[45%]'>
                                                                  <label htmlFor="">Street</label>
                                                                  <input type="text" className='input w-full'
                                                                        value={orderObj.billingObj.addressObj.street}
                                                                        onChange={(e) => setOrderObj(d => { d.billingObj.addressObj.street = e.target.value })} />
                                                            </div>

                                                            <div className='mt-2 w-[45%]'>
                                                                  <label htmlFor="">City</label>
                                                                  <input type="text" className='input w-full'
                                                                        value={orderObj.billingObj.addressObj.city}
                                                                        onChange={(e) => setOrderObj(d => { d.billingObj.addressObj.city = e.target.value })} />
                                                            </div>

                                                            <div className='mt-2 w-[45%]'>
                                                                  <label htmlFor="">State / County</label>
                                                                  <input type="text" className='input w-full'
                                                                        value={orderObj.billingObj.addressObj.state}
                                                                        onChange={(e) => setOrderObj(d => { d.billingObj.addressObj.state = e.target.value })} />
                                                            </div>

                                                            <div className='mt-2 w-[45%]'>
                                                                  <label htmlFor="">Post Code</label>
                                                                  <input type="text" className='input w-full'
                                                                        value={orderObj.billingObj.addressObj.postcode}
                                                                        onChange={(e) => setOrderObj(d => { d.billingObj.addressObj.postcode = e.target.value })} />
                                                            </div>

                                                            <div className='mt-2 w-[90%]'>
                                                                  <label htmlFor="">Email</label>
                                                                  <input type="text" className='input w-full'
                                                                        value={orderObj.billingObj.email}
                                                                        onChange={(e) => setOrderObj(d => { d.billingObj.email = e.target.value })} />
                                                            </div>

                                                            {/* {
                                                                  (admin?.accessLevel === "A" || admin?.accessLevel === "AA") &&

                                                                  <div className="mt-2 w-[90%]">
                                                                        <label htmlFor="">Date</label>
                                                                        <input
                                                                              type="datetime-local"
                                                                              className="input w-full"
                                                                              value={new Date(orderObj.createdAt).toISOString().slice(0, 16)}
                                                                              onChange={(e) =>
                                                                                    setOrderObj((d) => { d.createdAt = new Date(e.target.value).toISOString() })
                                                                              }
                                                                        />
                                                                  </div>

                                                            } */}

                                                      </div>

                                                }
                                          </div>

                                          <div
                                                className="absolute top-0 right-0 p-2 brand-panel text-white rounded cursor-pointer"
                                                onClick={() => setEditBilling(!editBilling)}
                                                title="Edit"
                                          >
                                                {editBilling ? <X size={16} /> : <Pencil size={16} />}
                                          </div>

                                          <div
                                                className="absolute top-10 right-0 p-2 brand-panel text-white rounded cursor-pointer"
                                                onClick={() => printShippingLabels([orderObj])}
                                          >
                                                <Printer size={16} />
                                          </div>

                                    </div>

                                    <div className='w-[30%] mt-4'>

                                          <div><strong>Checkout Details</strong></div>

                                          <div className='w-full mt-4 text-[90%]'>
                                                <div className=''>
                                                      <p className='text-muted'><b> Payment Method:</b> {orderObj.paymentGateway.name}</p>
                                                </div>
                                                <div className='mt-2'>
                                                      <p className='text-muted'> <b>Shipping Method :</b> {orderObj.shippingMethod.name} Delivery</p>
                                                </div>

                                                <div className='mt-2'>
                                                      <p className='text-muted'> <b>Order Date :</b> {new Date(orderObj.createdAt).toLocaleString()}</p>
                                                </div>

                                          </div>

                                    </div>


                              </div>

                        </div>

                  </div>

                  <div className="bg-white rounded max-w-[95vw] sm:w-[100%] mx-auto pb-6 sm:pb-6 mt-5 mb-5">

                        <div className="p-5">

                              <div className="w-full">
                                    <strong className='text-2xl'> Ordered Items</strong>
                              </div>

                              <div className='mb-3'>

                                    <div className="overflow-x-auto">
                                          <table className="table table-sm mt-5">
                                                <thead>
                                                      <tr>
                                                            <th>Product Package</th>
                                                            {admin?.accessLevel != "D" && <th>Price</th>}
                                                            <th>Qty</th>
                                                            {admin?.accessLevel != "D" && <th>Subtotal</th>}
                                                      </tr>
                                                </thead>
                                                <tbody>
                                                      {orderObj.cartItems.map((item, idx) => (
                                                            <tr key={idx}>
                                                                  <td>
                                                                        <div className="flex items-center mt-3">
                                                                              <Image width={200} height={200}
                                                                                    src={item.productObj.images[0]}
                                                                                    alt={item.productObj.name}
                                                                                    className="w-12 h-12 rounded object-cover"
                                                                              />
                                                                              <div className='ps-5'>
                                                                                    <div>   <Link className='text-blue-600 underline' href={"/product/" + item.productObj.slug}> {item.productObj.name}</Link> </div>
                                                                                    <div className='mt-3 text-muted'>
                                                                                          <div><strong className='pe-1'>Type: </strong> {item.productType}</div>
                                                                                          {
                                                                                                item.productType == "Bundles" &&
                                                                                                <>
                                                                                                      {item.bundleVariation?.selectFields.map((s, i) =>
                                                                                                            <div className='mt-2' key={i}><strong className='pe-1'>{'Option ' + (i + 1)} :</strong>  {s.value}</div>
                                                                                                      )}
                                                                                                </>
                                                                                          }

                                                                                          {
                                                                                                item.productType == "CheekyDeals" &&
                                                                                                <>
                                                                                                      {
                                                                                                            item.cheekyVariation!.map((v, i) =>
                                                                                                                  <div className='' key={i}>
                                                                                                                        {
                                                                                                                              v.selectFields.map((fv, i) =>
                                                                                                                                    <div className='mt-2' key={i}>
                                                                                                                                          <span><strong className='pe-1'>{v.category}</strong>: </span>
                                                                                                                                          <span>{fv.value}</span>
                                                                                                                                    </div>
                                                                                                                              )
                                                                                                                        }
                                                                                                                  </div>
                                                                                                            )
                                                                                                      }
                                                                                                </>
                                                                                          }
                                                                                    </div>
                                                                              </div>
                                                                        </div>
                                                                  </td>

                                                                  {admin?.accessLevel != "D" && <>
                                                                        <td>
                                                                              £
                                                                              {(item.productType === "Single" || item.productType == "CheekyDeals") && item.productObj.price}
                                                                              {item.productType === "Bundles" && item.bundleVariation!.price}
                                                                        </td>
                                                                  </>}

                                                                  <td>{item.cartQty}</td>

                                                                  {admin?.accessLevel != "D" && <>
                                                                        <td>£{item.productType === "Single" || item.productType === "CheekyDeals" ? item.cartQty * item.productObj.price : item.bundleVariation!.price}</td>
                                                                  </>}
                                                            </tr>
                                                      ))}
                                                </tbody>
                                          </table>

                                          {/* <hr className='mt-3' />

                                          <div className='sm:w-[40%] ms-auto mt-5 brand-tint p-4 rounded'>

                                                <div className="flex justify-between">
                                                      <div className=""><b> Subtotal:</b></div>
                                                      <div> +{CURRENCY_SYMBOL}{orderObj.amountSubTotal}</div>
                                                </div>

                                                <div className='w-full mt-7'>
                                                      <strong>Delivery</strong>
                                                </div>

                                                <div className="flex justify-between mt-1">
                                                      <div className="text-muted"> {orderObj.shippingMethod.name}</div>
                                                      <div> +{CURRENCY_SYMBOL}{orderObj.shippingMethod.fee}</div>
                                                </div>

                                                {
                                                      orderObj.coupons.length > 0 &&
                                                      <>
                                                            <div className='w-full mt-4'>
                                                                  <strong>Coupons</strong>
                                                            </div>


                                                            {
                                                                  orderObj.coupons.map(c =>
                                                                        <div key={c.code} className="flex justify-between mt-1">
                                                                              <div className="text-muted" > {c.code}</div>
                                                                              <div> - {CURRENCY_SYMBOL}{c.cartDiscount}  </div>
                                                                        </div>
                                                                  )
                                                            }

                                                      </>
                                                }

                                                {
                                                      parseFloat(orderObj.useBalance) > 0 &&

                                                      <>
                                                            <div className='w-full mt-4'>
                                                                  <strong>Use Balance</strong>
                                                            </div>

                                                            <div className="flex justify-between mt-1">
                                                                  <div className="text-muted">Use from balance</div>
                                                                  <div> -{CURRENCY_SYMBOL} {orderObj.useBalance}</div>
                                                            </div>

                                                      </>
                                                }

                                                <div className="flex justify-between mt-7">
                                                      <div className=""><b> Total:</b></div>
                                                      <div> {CURRENCY_SYMBOL}{orderObj.amountTotal}</div>
                                                </div>


                                          </div> */}
                                    </div>
                              </div>
                        </div>
                  </div >

            </div >
      );
};

export default AdminManageOrderPage;
