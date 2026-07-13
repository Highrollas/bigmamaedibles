'use client'

import { CURRENCY_SYMBOL, DELIVERY_METHODS } from '@/constants'
import React, { useEffect, useState } from 'react'
import useCartStore from '@/app/hooks/store/cart';
import useCheckoutStore from '@/app/hooks/store/checkout';
import { VoucherObj } from '@/Interface';
import { XIcon } from 'lucide-react';



const DeliveryMethod = () => {

      const cartTotal = useCartStore(c => c.cartTotal());
      const [mounted, setMounted] = useState(false);
      const { checkoutObj, setCheckoutObj } = useCheckoutStore();

      const shippingFee = DELIVERY_METHODS.find(d => d.alias === checkoutObj.shippingMethodAlias)?.fee || 0;

      const calculateVoucherDiscount = (cartTotal: number, coupons: VoucherObj[]) => {
            return coupons
                  .reduce((acc, coupon) => {
                        if (coupon.discountType === 'fixedAmount') {
                              return acc + coupon.cartDiscount;
                        } else if (coupon.discountType === 'discount') {
                              return acc + (cartTotal * (coupon.cartDiscount / 100));
                        }
                        return acc;
                  }, 0);
      }

      useEffect(() => {

            setMounted(cartTotal > 0 ? true : false);
            if (cartTotal >= 100) {
                  setCheckoutObj(d => { d.shippingMethodAlias = "24hrs-free-delivery" });
            } else {
                  setCheckoutObj(d => {
                        d.shippingMethodAlias =
                              d.shippingMethodAlias === "24hrs-free-delivery"
                                    ? "24hrs-delivery" : d.shippingMethodAlias
                  });
            }

            const voucherDiscount = calculateVoucherDiscount((cartTotal + shippingFee), checkoutObj.coupons);
            const _finalTotal = (cartTotal + shippingFee) - voucherDiscount - parseFloat(checkoutObj.useBalance);
            const finalTotal = _finalTotal < 0 ? 0 : _finalTotal;

            setCheckoutObj(d => { d.finalTotal = finalTotal });

      }, [cartTotal, setCheckoutObj, checkoutObj, shippingFee]);

      useEffect(() => {

            setCheckoutObj(d => { d.coupons = d.coupons.filter(c => c.voucherType === "referral" ? cartTotal >= 50 ? true : false : true) })

      }, [cartTotal, setCheckoutObj]);

      const removeCoupon = (_id: string) => {
            setCheckoutObj((d) => { d.coupons = checkoutObj.coupons.filter(c => c._id != _id) });
      }


      const getDeliveryDate = () => {

            const now = new Date();
            const day = now.getDay();  // Sunday = 0, Monday = 1, ... Saturday = 6
            const hour = now.getHours();

            const isAfter4PM = hour >= 16;

            let arrivesOn = '';

            if (
                  // From Friday 4pm onwards until Monday 4pm
                  (day === 5 && isAfter4PM) ||
                  (day === 6) ||  // Saturday
                  (day === 0) ||  // Sunday
                  (day === 1 && !isAfter4PM) // Monday before 4pm
            ) {
                  arrivesOn = 'Tuesday';
            }
            else if (day === 1 && isAfter4PM) { // Monday after 4pm → Tuesday 4pm
                  arrivesOn = 'Wednesday';
            }
            else if (day === 2 && isAfter4PM) { // Tuesday after 4pm
                  arrivesOn = 'Thursday';
            }
            else if (day === 3 && isAfter4PM) {// Wednesday after 4pm
                  arrivesOn = 'Friday';
            }
            else if (day === 4 && isAfter4PM) { // Thursday after 4pm
                  arrivesOn = 'Saturday';
            }
            else if (day === 5 && !isAfter4PM) { // Friday before 4pm
                  arrivesOn = 'Saturday';
            }
            else if (day === 1 && !isAfter4PM) { // Monday before 4pm
                  arrivesOn = 'Tuesday';
            }
            else if (day === 2 && !isAfter4PM) { // Tuesday before 4pm
                  arrivesOn = 'Wednesday';
            }
            else if (day === 3 && !isAfter4PM) {  // Wednesday before 4pm
                  arrivesOn = 'Thursday';
            }
            else if (day === 4 && !isAfter4PM) {  // Thursday before 4pm
                  arrivesOn = 'Friday';
            }
            else {
                  // fallback, should not happen
                  arrivesOn = 'Tuesday';
            }

            return `Arrives On ${arrivesOn}`;
      };

      if (!mounted) return null

      return (

            <>

                  <tr className='text-center'>
                        <td className='text-2xl cursor-pointer'></td>
                        <td >
                              🚚
                        </td>
                        <td>
                              {
                                    DELIVERY_METHODS.map((dm, i) =>
                                          <div key={i}>
                                                {(dm.minOrderAmount <= cartTotal && dm.maxOrderAmount >= cartTotal) &&
                                                      <div className='flex gap-2'>
                                                            <div> {dm.name} <span className='ms-1'>[{getDeliveryDate()}]</span></div>
                                                      </div>
                                                }
                                          </div>
                                    )
                              }
                        </td>

                        <td>
                              1
                        </td>

                        <td>
                              {CURRENCY_SYMBOL}{shippingFee}
                        </td>
                  </tr>

                  {(checkoutObj.billingObj.addressObj.country === "Nothern Ireland" || checkoutObj.billingObj.addressObj.country === "Scotland") &&
                        <tr className='brand-accent-bg'>
                              <td className='text-center'>⚠️</td>
                              <td className='text-[70%]'>May Be Delayed By 24Hrs Because Of Distance </td>
                        </tr>
                  }

                  {checkoutObj.coupons.length > 0 &&
                        checkoutObj.coupons.map((c, i) =>
                              <tr key={i}>
                                    <td className='text-center'>
                                          {c.voucherType === "referral" ? "Referral" : "Voucher"}
                                    </td>
                                    <td>
                                          <div className='flex items-center justify-between'>
                                                <div>-{c.discountType == "discount" ? "%" : CURRENCY_SYMBOL}{c.cartDiscount} <span className='border-b-2 ms-2'> {c.code}</span></div>
                                                <div onClick={() => removeCoupon(c._id)} className='bg-[#e21893] h-5 w-5 flex items-center justify-center cursor-pointer rounded-[100%]'>
                                                      {<XIcon color="white" size={12} strokeWidth={4} />}
                                                </div>
                                          </div>
                                    </td>
                              </tr>
                        )
                  }

                  {(checkoutObj.useBalance && parseFloat(checkoutObj.useBalance) >= 1) ?
                        <tr >
                              <td className='text-center'>
                                    Use Balance
                              </td>
                              <td>
                                    <div className='flex items-center justify-between'>
                                          <div>-{CURRENCY_SYMBOL}{checkoutObj.useBalance}</div>
                                          <div onClick={() => setCheckoutObj(d => { d.useBalance = "0" })} className='bg-[#e21893] h-5 w-5 flex items-center justify-center rounded-[100%]'>
                                                {<XIcon color="white" size={12} strokeWidth={4} />}
                                          </div>
                                    </div>
                              </td>
                        </tr> : null
                  }

                  {/* <tr>
                        <td className='text-center'>
                              Total
                        </td>
                        <td>
                              {CURRENCY_SYMBOL}{checkoutObj?.finalTotal?.toFixed(2)}
                        </td>
                  </tr> */}





                  {((cartTotal > 50 && cartTotal < 100) || cartTotal >= 100) &&

                        <div className="bg-[#e21893] text-white p-3 flex justify-center font-bold! text-[85%]">
                              {(cartTotal > 50 && cartTotal < 100) && `You Are ${CURRENCY_SYMBOL}${100 - cartTotal} Away From Free 24hr Delivery 😏`}
                              {cartTotal >= 100 && `This Order Includes Free 24hr Delivery 🥳`}
                        </div>
                  }

            </>
      )
}

export default DeliveryMethod


