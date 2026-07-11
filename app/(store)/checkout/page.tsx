/* eslint-disable prefer-const */
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import CartItemList from '@/app/components/client/CartItemList';
import DeliveryMethod from '@/app/components/client/DeliveryMethod';
import PaymentMethod from '@/app/components/client/PaymentMethod';
import useCheckoutStore from '@/app/hooks/store/checkout';
import useCartStore from '@/app/hooks/store/cart';
import BillingAddress from '@/app/components/client/BillingAddress';
import { BillingObj } from '@/Interface';
import useSessionStore from '@/app/hooks/auth/user';
import DefaultAddress from '@/app/components/client/DefaultAddress';
import APIClient from '@/app/services/apiClient';
import useAlertStore from '@/app/hooks/store/alert';
import Link from 'next/link';

interface CheckoutResp {
      status: "success" | "failed";
      message: string;
      paymentStatus: "completed" | "pending";
      paymentId: string;
      orderId: string;
}

const CheckoutPage = () => {

      const { carts } = useCartStore();
      const { checkoutObj, setCheckoutObj, isValid } = useCheckoutStore();
      const router = useRouter();
      const { user } = useSessionStore();
      const { setModalMessage } = useAlertStore();
      const [checkoutLoading, setCheckoutLoading] = useState(false);


      useEffect(() => {

            if (carts.length === 0) {
                  router.push('/cart');
                  return
            }

            setCheckoutObj(d => { d.cartItems = carts });

            if (user) {

                  const billingObj: BillingObj[] = user.billingObj.map(b => ({ ...b })); // create a new array to avoid direct mutation
                  let defaultBillingObj = billingObj.find(b => b.default === true);

                  if (defaultBillingObj) {
                        defaultBillingObj = { ...defaultBillingObj, email: user.email };
                        setCheckoutObj(d => { d.billingObj = defaultBillingObj! });
                  }

                  if (!defaultBillingObj && billingObj.length > 0) {
                        const firstBilling = { ...billingObj[0], email: user.email };
                        setCheckoutObj(d => { d.billingObj = firstBilling });
                  }
            }

      }, [carts, router, setCheckoutObj, user])

      const setBillingObj = (updater: (prev: BillingObj) => void) => {
            setCheckoutObj((state) => {
                  updater(state.billingObj);
            });
      };

      const handleCheckout = async () => {

            setCheckoutLoading(true);

            const resp = await new APIClient<CheckoutResp>('checkout').post({ ...checkoutObj });
            if (resp.status == "success") {

                  if (resp.paymentStatus == "pending") {
                        router.push(`/pay/${checkoutObj.paymentGatewayAlias}/${resp.paymentId}`);
                  } else {
                        router.push("/thank-you/" + resp.orderId);
                  }

            } else {
                  setModalMessage(resp.message);
            }

            setCheckoutLoading(false);
      }


      return (

            <div className='w-[90%] sm:w-[70%] lg:w-[55%] mx-auto my-5'>

                  <div className='flex justify-center items-center gap-2 mt-12 mb-3'>
                        <h3 className='text-[20px] sm:text-2xl'>
                              🏡 Delivery Details
                        </h3>
                  </div>

                  {!user && <BillingAddress billingObj={checkoutObj.billingObj} setBillingObj={setBillingObj} />}

                  {user && <DefaultAddress billingObj={checkoutObj.billingObj} showChangeDefault={true} />}

                  <div className='flex justify-center items-center gap-2 mt-12 mb-8'>
                        <h3 className='text-[20px] sm:text-2xl'>
                              📦 Your Order
                        </h3>
                  </div>

                  <div>
                        <CartItemList voucherEnabled={true} />
                  </div>

                  <div className='flex justify-center items-center gap-2 mt-12 mb-8'>
                        <h3 className='text-[20px] sm:text-2xl'>
                              🚚 Delivery Method
                        </h3>
                  </div>

                  <DeliveryMethod />

                  <div></div>


                  {checkoutObj.finalTotal! > 0 &&
                        <>
                              <div className='flex justify-center items-center gap-2 mt-12 mb-8'>
                                    <h3 className='text-[20px] sm:text-2xl'>
                                          💷 Payment
                                    </h3>
                              </div>

                              <PaymentMethod />
                        </>

                  }

                  <hr className='mt-12' />

                  <div className="mt-6 text-center"
                        onClick={() => setCheckoutObj(d => { d.termsAndCondtionAccepted = !checkoutObj.termsAndCondtionAccepted })}>
                        <div className='flex justify-center gap-2'>
                              <div className='flex items-center'>
                                    <input readOnly checked={checkoutObj.termsAndCondtionAccepted} className='h-4 w-4' type="checkbox" />
                              </div>
                              <p> I Have Read And Agreed To The <Link className="text-blue-700 underline" href="/terms-and-conditions">T&C</Link> </p>
                        </div>
                  </div>

                  <div className="mt-6 mb-12 text-center">
                        <button disabled={!isValid || checkoutLoading} onClick={() => handleCheckout()} className='btn w-full'>
                              Place Order {checkoutLoading && <span className="loading loading-spinner w-5 h-5"></span>}
                        </button>
                  </div>

            </div>

      )
}

export default CheckoutPage


