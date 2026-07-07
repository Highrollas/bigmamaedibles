'use client'

import AlertMessage2 from '@/app/components/client/AlertMessage2';
import LabelInput from '@/app/components/client/LabelInput'
import useRegistrationStore from '@/app/hooks/auth/register';
import useAlertStore from '@/app/hooks/store/alert';
import APIClient from '@/app/services/apiClient';
import Image from 'next/image'
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';


const RegisterPage = () => {

      const { registrationObj, setRegistrationObj, setRegStage } = useRegistrationStore();
      const { setModalMessage, setMessage2 } = useAlertStore();
      const [referralCodeWarned, setReferralCodeWarned] = useState(false);
      const [couponEditDisabled, setCouponEditDisabled] = useState(false);

      // ✅ Prefill referralCoupon if ?coupon= is present
      useEffect(() => {
            if (typeof window !== 'undefined') {
                  const params = new URLSearchParams(window.location.search);
                  const couponParam = params.get('coupon');
                  if (couponParam && couponParam !== "") {
                        setRegistrationObj((d) => {
                              d.referralCoupon = couponParam.trim().toLocaleUpperCase();
                        });
                        // eslint-disable-next-line react-hooks/set-state-in-effect
                        setCouponEditDisabled(true);
                  }
            }
      }, [setRegistrationObj]);


      const handleRegister = async () => {

            if (registrationObj.username === "") {
                  return setModalMessage("Kindly Input Your Username To Continue");
            }

            if (registrationObj.email === "") {
                  return setModalMessage("Kindly Input Your Email To Continue");
            }

            if (registrationObj.password === "") {
                  return setModalMessage("Kindly Input Your Password");
            }

            if (registrationObj.rePassword === "") {
                  return setModalMessage("Kindly Re-enter Your Passord For Comfirmation");
            }

            if (registrationObj.rePassword !== registrationObj.password) {
                  return setModalMessage("Password Mismatch, Kindly Input Correct Password");
            }

            if (registrationObj.referralCoupon === "" && !referralCodeWarned) {
                  setReferralCodeWarned(true);
                  return setModalMessage("Are You Sure You Would Like To Continue Without Entering A Referral Code? You Could Be Missing Out On Saving Money 🥲.  Click Next Again To Continue Without A Referral Code");
            }

            setMessage2("loading");

            const resp = await new APIClient<{ status: string; message: string }>('auth/register/validate').post({ ...registrationObj });
            if (resp.status === "success") {
                  setMessage2("Account Created, Loading…");
                  setRegStage("verify-code");
                  redirect("/account/register/email-verify");
            } else {
                  setMessage2(resp.message, "error");
            }

      }

      return (

            <div className='h-[99dvh] w-full flex items-center'>

                  <div className='w-full'>

                        <div className="mb-5">
                              <Image src="/assets/images/user.png" className='mx-auto' height={120} width={120} alt='user image' />
                        </div>

                        <AlertMessage2 />

                        <div className="w-[75%] sm:w-[50%] mx-auto">
                              <div className='mt-5'>
                                    <LabelInput label='Username' type='text' pre={"@"} value={registrationObj.username}
                                          onChange={(v) => setRegistrationObj(d => { d.username = v ? v.trim() : "" })} />
                              </div>
                              <div className='mt-5'>
                                    <LabelInput label='Email' type='text' value={registrationObj.email}
                                          onChange={(v) => setRegistrationObj(d => { d.email = v ? v.trim() : ""; d.billingObj.email = v ? v.trim() : "" })} />
                              </div>
                              <div className='mt-5'>
                                    <LabelInput label='Password' type='password' value={registrationObj.password}
                                          onChange={(v) => setRegistrationObj(d => { d.password = v ? v.trim() : "" })} />
                              </div>
                              <div className='mt-5'>
                                    <LabelInput label='Re-enter Password' type='password' value={registrationObj.rePassword}
                                          onChange={(v) => setRegistrationObj(d => { d.rePassword = v ? v.trim() : "" })} />
                              </div>
                              <div className='mt-5'>
                                    <LabelInput readOnly={couponEditDisabled} label='Referral Code' className='uppercase' type='text' value={registrationObj.referralCoupon}
                                          onChange={(v) => setRegistrationObj(d => { d.referralCoupon = v ? v.trim().toLocaleUpperCase() : "" })} />
                              </div>

                              <div className='mt-6'>
                                    <button onClick={() => handleRegister()} className='btn w-full'>Next</button>
                              </div>

                              <div className='mt-6 text-center'>
                                    <Link className='text-blue-700 font-bold text-[90%]' href="/account/login">Already Have An Account ? Login Here</Link>
                              </div>

                        </div>
                  </div>
            </div>
      )
}

export default RegisterPage
