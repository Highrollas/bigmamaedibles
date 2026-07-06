
'use client'

import useCartStore from '@/app/hooks/store/cart';
import FallbackImage from '../client/FallbackImage';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { CURRENCY_SYMBOL } from '@/constants';
import useCheckoutStore from '@/app/hooks/store/checkout';
import APIClient from '@/app/services/apiClient';
import { VoucherObj } from '@/Interface';
import useSessionStore from '@/app/hooks/auth/user';
import { scrollIntoViewById } from '@/app/Helper';
import useAlertStore from '@/app/hooks/store/alert';
import Link from 'next/link';


interface fetchCouponResp {
      status: string;
      message: string;
      voucher: VoucherObj
}


const CartItemList = ({ voucherEnabled }: { voucherEnabled?: boolean }) => {

      const { carts, remove, cartTotal } = useCartStore();
      const { checkoutObj, setCheckoutObj } = useCheckoutStore();
      const [mounted, setMounted] = useState(false);
      const [useVoucherState, setUseVoucherState] = useState(false);
      const [useBalanceState, setUseBalanceState] = useState(false);
      const [coupon, setCoupon] = useState("");
      const [useBalanceAmount, setUseBalanceAmount] = useState("");
      const { user } = useSessionStore();
      const { setModalMessage } = useAlertStore();
      const [couponLoading, setCouponLoading] = useState(false);
      const [couponUsed, setCouponUsed] = useState(false);

      const applyVoucher = React.useCallback(async (_coupon: string | null = null, silent = false) => {

            const couponCode = _coupon ?? coupon

            if (couponCode === "" || couponCode.length <= 3) {
                  if (_coupon) return
                  return setModalMessage("Kindly Enter A Valid Voucher Code");
            }

            if (checkoutObj.coupons.find(c => c.code == couponCode)) {
                  if (_coupon) return
                  return setModalMessage("Voucher Already Added To This Order");
            }

            setCouponLoading(true);

            const reqObj = { coupon: couponCode };
            const resp = await new APIClient<fetchCouponResp>('vouchers').post(reqObj);
            if (resp.status == "success") {

                  if (resp.voucher.voucherType === "referral" && (cartTotal() < 50)) {
                        setCouponLoading(false);
                        return setModalMessage("Order Total Cannot Be Less Than £50 To Use Voucher");
                  }

                  if (!checkoutObj.coupons.find(c => c.code == couponCode)) {
                        setCheckoutObj((d) => { d.coupons.push(resp.voucher) });
                  }

                  setCoupon("");
                  setCouponLoading(false);
                  setUseVoucherState(false);

            } else {

                  setCouponLoading(false);

                  if (!silent) {
                        setModalMessage(resp.message);
                  }

            }


      }, [coupon, checkoutObj.coupons, setModalMessage, setCheckoutObj, cartTotal]);

      const applyUseBalance = () => {

            if (useBalanceAmount == "" || parseFloat(useBalanceAmount) < 1) {
                  return setModalMessage("Kindly Enter A Valid Amount To Use");
            }

            if (parseFloat(useBalanceAmount) > (parseFloat(user!.balance) || 0)) {
                  return setModalMessage("You Cheeky Cow 🤨 The Amount You Entered Is Higher Than Your Available Balance");
            }

            setUseBalanceState(false);
            setCheckoutObj((d) => { d.useBalance = useBalanceAmount });
            scrollIntoViewById("cartItemsTable");
            setUseBalanceAmount("");

      }

      useEffect(() => {

            if (!mounted) setMounted(true);
            if (user && location.pathname == "/checkout") {
                  if (user.referralCouponUsed == false && user.referralCoupon.length > 0) {
                        if (cartTotal() >= 50) {
                              applyVoucher(user.referralCoupon, true);
                        }
                  }
            }

      }, [carts, cartTotal, user, mounted, applyVoucher]);

      useEffect(() => {

            if (!checkoutObj?.coupons) return;

            // remove duplicate coupons
            const uniqueCoupons = checkoutObj.coupons.filter(
                  (c, idx, arr) =>
                        idx === arr.findIndex(other => other.code === c.code)
            );

            //make update if there is duplicate
            if (uniqueCoupons.length !== checkoutObj.coupons.length) {
                  setCheckoutObj(prev => ({
                        ...prev,
                        coupons: uniqueCoupons,
                  }));
            }

      }, [checkoutObj.coupons, setCheckoutObj]);


      if (!mounted) return null

      if (carts.length === 0) return (
            <div className='w-[80%] mx-auto pt-[40px] pb-[28px] text-center'>
                  <h2 className='text-2xl mb-5'>Box Is Empty ☹️</h2>
                  <p>
                        Return To The <Link href='/' className='text-blue-700 font-bold! mx-1'>Homepage</Link> To View Products Or
                        <label htmlFor="category-drawer" className='text-blue-700 font-bold! mx-1'>Open Menu</label>
                        To Select A Category
                  </p>
            </div>
      )

      return (

            <div>

                  <table id='cartItemsTable' className={`table bordered-table table-sm font-bold! mt-5 border-separate rounded-[5px] border-spacing-0 " ${voucherEnabled && " rounded-b-[0px]!"}`}>

                        <thead className='brand-table-head text-center'>
                              <tr>
                                    <th className="w-[5%]"></th>
                                    <th className="w-[20%]">Pic</th>
                                    <th className="w-[50%]">Product</th>
                                    <th className="w-[10%]">Qty</th>
                                    <th className="w-[15%]">£</th>
                              </tr>
                        </thead>

                        <tbody>

                              {
                                    carts.map((c, i) =>
                                          <tr key={i} className='text-center'>
                                                <th onClick={() => remove(c.id)} className='text-2xl cursor-pointer'>×</th>
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
                  {voucherEnabled &&
                        <div className="brand-strip text-white p-3 flex justify-between rounded-b-[5px]">

                              {useVoucherState &&

                                    <div className="flex items-center justify-between w-full">

                                          <div onClick={() => setUseVoucherState(false)} className='flex items-center cursor-pointer'>
                                                <span className='text-2xl font-bold! mb-1'>×</span>
                                          </div>

                                          <div className='flex items-center'>
                                                <span className='text-[65%] font-bold!'>Type Voucher Code Here</span>
                                          </div>
                                          <input onChange={(e) => setCoupon(e.target.value)} className='bg-white text-black w-[32%] font-bold text-[80%] ps-2 uppercase rounded h-[22px]' />
                                          <button disabled={couponLoading} className='btn btn-sm bg-white! text-black! py-0! px-2! h-[22px] text-[65%] font-bold! tracking-normal!'
                                                onClick={() => applyVoucher()}>
                                                {couponLoading ? <span className="loading loading-spinner w-5 h-5 brand-border"></span> : 'Apply'}
                                          </button>

                                    </div>

                              }

                              {(!useVoucherState && !useBalanceState) &&

                                    <div onClick={() => setUseVoucherState(true)} className="flex items-center cursor-pointer">
                                          <Image className='h-[21px] w-auto me-3' width={250} height={250} alt='voucher icon' src="/assets/images/voucher-icon.png" />
                                          <div className='border-b-2 font-bold! text-[80%] mb-1'>Use Voucher</div>
                                    </div>

                              }

                              {useBalanceState &&

                                    <div className="flex items-center justify-between w-full">

                                          <div onClick={() => setUseBalanceState(false)} className='flex items-center cursor-pointer'>
                                                <span className='text-2xl font-bold! mb-1'>×</span>
                                          </div>

                                          <div className='flex items-center justify-center'>
                                                <span className='text-[65%] font-bold!'> Balance: {CURRENCY_SYMBOL}{user?.balance} / I Would Like To Use</span>
                                          </div>


                                          <div className="rounded bg-white text-black flex items-center ps-2 h-[22px]">
                                                <div className="font-bold! text-[85%] mt-[2.1px]">£</div>
                                                <input value={useBalanceAmount} type="number" pattern="[0-9]*" inputMode='numeric' className="mt-[1.7px] mb-[2px] h-[21px]! p-[4px]! w-[40px]! font-bold! text-[70%] outline-0! shadow-[0]! border-0 px-0 rounded"
                                                      onChange={(e) => setUseBalanceAmount(e.target.value)} />
                                          </div>


                                          <button className='btn btn-sm bg-white! text-black! py-0! px-2! h-[22px] text-[65%] font-bold! tracking-normal!'
                                                onClick={() => applyUseBalance()}>Apply</button>
                                    </div>

                              }

                              {(user && !useBalanceState && !useVoucherState) &&

                                    <div onClick={() => setUseBalanceState(true)} className="flex items-center">
                                          <Image className='h-[21px] w-auto me-3' width={250} height={250} alt='balance icon' src="/assets/images/usebalance-icon.png" />
                                          <div className='border-b-2 font-bold! text-[80%] mb-1'>Use Balance</div>
                                    </div>
                              }

                        </div>
                  }

            </div>

      )
}

export default CartItemList

