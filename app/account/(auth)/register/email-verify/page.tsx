'use client'

import AlertMessage2 from '@/app/components/client/AlertMessage2'
import LabelInput from '@/app/components/client/LabelInput'
import useRegistrationStore from '@/app/hooks/auth/register'
import useAlertStore from '@/app/hooks/store/alert'
import APIClient from '@/app/services/apiClient'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React, { useEffect } from 'react'

const EmailVerifyPage = () => {


      const { registrationObj, setRegistrationObj, regStage, setRegStage } = useRegistrationStore();
      const { setMessage2 } = useAlertStore();

      useEffect(() => {
            if (regStage != "verify-code") return redirect("/account/register");
      }, [])

      const handleNext = async () => {

            setMessage2("loading");

            if (registrationObj.verificationCode === "" || registrationObj.verificationCode.length < 4) {
                  return setMessage2("Kindly Input  A Valid Verification Code", "error")
            }

            const resp = await new APIClient<{ status: string; message: string }>('auth/register/verify-email').post({ ...registrationObj });
            if (resp.status === "success") {
                  setMessage2("Email Verified, Loading…");
                  setRegStage("address");
                  redirect("/account/register/address");
            } else {
                  setMessage2(resp.message, "error");
            }

      }

      return (

            <div className="w-[90%] sm:w-[70%] lg:w-[55%] mx-auto">

                  <div className="flex justify-between mt-10">
                        <button onClick={() => redirect('/account/register')} className="btn bg-[#e21893] text-white px-3! py-1!">Back</button>
                  </div>

                  <div className="mt-10 mb-5 text-center">
                        <Image className='mx-auto' height="130" width="130" src="/assets/images/email-verify.jpg" alt="email verify" />

                        <p className="my-5 px-4 font-bold! text-[12px]">
                              We Have Sent A Verification Code To
                              <span className='font-bold! text-[12px] underline mx-1'>{registrationObj.email}</span> <br />
                              Please Enter The Code Below <br /><br />
                              If You Have Entered An Incorrect Email, Click The Back Button At The Top Of This Page To Make Changes
                        </p>

                  </div>

                  <div className="mt-5">

                        <AlertMessage2 />

                        <div className="w-[80%] sm:w-[50%] mx-auto">

                              <div className="w-full mt-3 mb-3">
                                    <LabelInput value={registrationObj.verificationCode} label='Verification Code' type='number'
                                          onChange={(v) => setRegistrationObj((d) => { d.verificationCode = v })} />
                              </div>

                              <div className="w-full mt-8 text-end">
                                    <button onClick={handleNext} className="btn bg-[#e21893] text-white br-5 w-full"> Next </button>
                              </div>

                        </div>

                  </div>

            </div>
      )
}

export default EmailVerifyPage
