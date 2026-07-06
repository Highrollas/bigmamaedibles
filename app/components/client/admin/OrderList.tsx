'use client';

import { getOrderStatusText, getStatusClass, printShippingLabels } from '@/app/Helper';
import useOrdersStore from '@/app/hooks/store/order';
import { Eye, Trash, X } from 'lucide-react';
import React, { useState } from 'react';
import FilterComponent from './FilterComponent';
import Link from 'next/link';
import { CURRENCY_SYMBOL } from '@/constants';
import { OrderObj, ReqResp } from '@/Interface';
import Image from 'next/image';
import useAlertStore from '@/app/hooks/store/alert';
import APIClient from '@/app/services/apiClient';
import useAdminSessionStore from '@/app/hooks/auth/admin';

const AdminOrdersList = () => {

      const { orders, filterQuery, setFilterQuery, fetchOrders, loading, saveOrders } = useOrdersStore();
      const [selectedOrder, setSelectedOrder] = useState<OrderObj | null>(null);
      const { setModalMessage } = useAlertStore();
      const [selectedStatus, setSelectedStatus] = useState("");

      const { admin } = useAdminSessionStore();
      const isAccessLevelD = admin?.accessLevel === "D";
      const visibleOrders = isAccessLevelD
            ? orders.filter(order => order.status === "on-hold")
            : orders;

      const handleDelete = async (order: OrderObj) => {

            const confirmDelete = await setModalMessage("Are You Sure You Want To Delete This Order ?", "dialog");

            if (confirmDelete) {

                  const resp = await new APIClient<ReqResp & { order: OrderObj }>('admin/orders?id=' + order._id).delete();
                  if (resp.status === "success") {
                        setModalMessage("Order Successfully Deleted");
                        saveOrders(orders.filter(o => o._id !== order._id));
                  } else {
                        setModalMessage(resp.message);
                  }
            }
      }

      const printOrderSlips = () => {
            const _orders = visibleOrders.filter(o => o.formChecked == true);
            if (_orders.length === 0) {
                  setModalMessage("Choose at least one order to print label");
                  return
            }
            printShippingLabels(_orders);
      }

      const checkAllOrder = () => {
            const visibleOrderIds = new Set(visibleOrders.map(o => o._id));
            saveOrders(orders.map(o => {
                  if (!visibleOrderIds.has(o._id)) return o;
                  return { ...o, formChecked: !o.formChecked };
            }));
      }

      const bulkSetOrderStatus = async () => {

            const _orders = visibleOrders.filter(o => o.formChecked);
            if (_orders.length === 0) return setModalMessage("Select at least one order to update");
            if (!selectedStatus || selectedStatus == "") return setModalMessage("Select a status to apply");

            const confirm = await setModalMessage(`Confirm changing status of ${_orders.length} orders to "${selectedStatus}"?`, "dialog");
            if (!confirm) return;

            const ids = _orders.map(o => o._id);

            const res = await new APIClient<ReqResp>('admin/orders/bulk-set-status').post({
                  ids,
                  status: selectedStatus
            });

            if (res.status === "success") {
                  setModalMessage("Status updated successfully");
                  fetchOrders();
                  setSelectedStatus('');
            } else {
                  setModalMessage(res.message);
            }

      }


      return (
            <div>
                  <div className="overflow-x-auto bg-white rounded max-w-[95vw] sm:w-[100%] mx-auto mb-6 sm:mb-12">

                        <div className='flex items-center justify-between'>

                              <div className='w-[60%]'>
                                    <FilterComponent
                                          filterQuery={filterQuery}
                                          setFilterQuery={setFilterQuery}
                                          showDateFilter={false}
                                          showOrderStatus={true}
                                          onApply={fetchOrders}
                                    />
                              </div>

                              {
                                    (admin?.accessLevel === "A" || admin?.accessLevel === "AA" || admin?.accessLevel === "D") &&
                                    <>

                                          <div className='border brand-border h-[40px]'></div>

                                          <div className='w-[10%] text-center'>
                                                <button onClick={() => printOrderSlips()} className='btn'>Print Slip</button>
                                          </div>

                                          <div className='border brand-border h-[40px]'></div>

                                          <div className='w-[25%] flex items-center gap-2'>
                                                <div className="">
                                                      <select
                                                            className="select select-bordered select-sm w-full"
                                                            value={selectedStatus}
                                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                                      >
                                                            <option value="">-- Change Status --</option>
                                                            <option value="on-hold">Preparing</option>
                                                            <option value="processing">Shipped</option>
                                                            <option value="completed">Delivered</option>
                                                            <option value="pending">Pending</option>
                                                            <option value="cancelled">Cancelled</option>
                                                      </select>
                                                </div>
                                                <button onClick={() => bulkSetOrderStatus()} className='btn'>Set Status</button>
                                          </div>
                                    </>
                              }

                        </div>

                        {loading &&
                              <div className='flex justify-center items-center h-[100px] w-full mx-auto'>
                                    <span className="loading loading-spinner w-5 h-5 brand-border"></span>
                              </div>
                        }

                        {!loading && visibleOrders.length === 0 &&
                              <div className='text-center w-full my-12'>Orders Not Found For Selected Query</div>
                        }

                        {!loading && visibleOrders.length > 0 &&
                              <table className="table" style={{ zoom: ".75" }}>
                                    <thead>
                                          <tr>
                                                <th>
                                                      <input type="checkbox" className="checkbox"
                                                            onClick={() => checkAllOrder()} />
                                                </th>
                                                <th>OrderId</th>
                                                <th>Action</th>
                                                <th>Date Confirmed</th>
                                                <th>Status</th>
                                                {admin?.accessLevel != "D" && <th>Total</th>}
                                          </tr>
                                    </thead>
                                    <tbody>
                                          {visibleOrders.map((order, i) => (
                                                <tr key={i}>
                                                      <td><input onClick={() => order.formChecked = !order.formChecked} type="checkbox" className="checkbox" checked={order.formChecked} /></td>
                                                      <td>
                                                            <div className="flex font-bold items-center">
                                                                  <strong>
                                                                        {order.orderId} {order.billingObj.firstName} {order.billingObj.lastName}
                                                                  </strong>
                                                                  {(order.isFirstTime && (admin?.email == "emptyspace1912@outlook.com" || admin?.accessLevel === "AA")) && <div className='h-2 w-2 ms-1 bg-red-500 rounded-full'></div>}
                                                                  {(admin?.accessLevel === "AA" && order.isPatched) && <div className='h-2 w-2 ms-1 bg-yellow-500 rounded-full'></div>}
                                                            </div>
                                                      </td>
                                                      <td>
                                                            {
                                                                  (admin?.accessLevel === "A" || admin?.accessLevel === "AA" || admin?.accessLevel === "D") &&
                                                                  <Link href={`/admin/orders/manage/${order._id}`} className="btn btn-ghost btn-xs">Manage</Link>
                                                            }

                                                            <button
                                                                  className="btn btn-ghost btn-xs mx-2"
                                                                  onClick={() => setSelectedOrder(order)}
                                                            >
                                                                  <Eye />
                                                            </button>

                                                            {
                                                                  (admin?.accessLevel === "A" || admin?.accessLevel === "AA") &&
                                                                  <button className='btn' onClick={() => handleDelete(order)}>
                                                                        <Trash />
                                                                  </button>
                                                            }

                                                      </td>
                                                      <td>{new Date(order.orderFilled!).toLocaleString()}</td>
                                                      <td>
                                                            <div className={'rounded text-center py-2 w-[99px] ' + getStatusClass(order.status)}>
                                                                  {getOrderStatusText(order.status)}
                                                            </div>
                                                      </td>
                                                      {admin?.accessLevel != "D" && <td>{CURRENCY_SYMBOL}{order.amountTotal}</td>}
                                                </tr>
                                          ))}
                                    </tbody>
                                    <tfoot>
                                          <tr>
                                                <th><input type="checkbox" className="checkbox" /></th>
                                                <th>OrderId</th>
                                                <th>Action</th>
                                                <th>Date Confirmed</th>
                                                <th>Status</th>
                                                <th>Total</th>
                                                <th>Origin</th>
                                          </tr>
                                    </tfoot>
                              </table>
                        }
                  </div>

                  {/* Modal */}
                  {selectedOrder && (
                        <dialog id="order_modal" className="modal modal-open">
                              <div className="modal-box bg-white text-black max-w-2xl w-full relative">
                                    <h3 className="font-bold text-lg mb-4">Order: {selectedOrder.orderId}</h3>

                                    <div className="space-y-2 text-sm">
                                          <div><strong>Customer:</strong> {selectedOrder.billingObj.firstName} {selectedOrder.billingObj.lastName}</div>
                                          <div><strong>Address:</strong> {selectedOrder.billingObj.addressObj.street}, {selectedOrder.billingObj.addressObj.city},  {selectedOrder.billingObj.addressObj.country},  {selectedOrder.billingObj.addressObj.postcode}</div>
                                          <div><strong>Shipping:</strong> {selectedOrder.shippingMethod.name}</div>
                                          {admin?.accessLevel != "D" && <div><strong>SubTotal:</strong> {CURRENCY_SYMBOL}{selectedOrder.amountSubTotal}</div>}
                                          {selectedOrder.coupons?.length > 0 && (
                                                <div><strong>Coupons:</strong> {selectedOrder.coupons.map(c => c.code + ' -(' + CURRENCY_SYMBOL + c.cartDiscount + ')').join(', ')}</div>
                                          )}

                                          {
                                                parseFloat(selectedOrder.useBalance) > 0 && <div><strong>Use From Balance:</strong> -{CURRENCY_SYMBOL}{selectedOrder.useBalance}</div>
                                          }

                                          {admin?.accessLevel != "D" && <div><strong>Total:</strong> {CURRENCY_SYMBOL}{selectedOrder.amountTotal}</div>}

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
                                                      {selectedOrder.cartItems.map((item, idx) => (
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

                                                                  <td>
                                                                        <button className={'btn' + (item.cartQty > 1 ? ' bg-red-600!' : '')} >{item.cartQty}</button>
                                                                  </td>

                                                                  {admin?.accessLevel != "D" && <>

                                                                        <td>£ {item.productType === "Single" || item.productType === "CheekyDeals" ? item.cartQty * item.productObj.price : item.bundleVariation!.price}</td>
                                                                  </>}
                                                            </tr>
                                                      ))}
                                                </tbody>
                                          </table>
                                    </div>

                                    <button className="btn absolute right-2 top-2" onClick={() => setSelectedOrder(null)}>
                                          <X />
                                    </button>
                              </div>
                        </dialog>
                  )
                  }
            </div >
      );
};

export default AdminOrdersList;

