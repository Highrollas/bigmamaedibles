'use client'

import { ChevronLeft } from 'lucide-react';

import AlertMessage2 from '@/app/components/client/AlertMessage2'
import LabelInput from '@/app/components/client/LabelInput'
import useRegistrationStore from '@/app/hooks/auth/register'
import useAlertStore from '@/app/hooks/store/alert'
import APIClient from '@/app/services/apiClient'
import { redirect, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import BlockSection from '@/app/components/server/BlockSection';
import Heading from '@/app/components/server/partials/Heading';


const EmailVerifyPage = () => {


      const { registrationObj, setRegistrationObj, regStage, setRegStage } = useRegistrationStore();
      const { setMessage2 } = useAlertStore();

      const router = useRouter();

      useEffect(() => {
            // if (regStage != "verify-code") return redirect("/account/register");
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

            <div>

                  <div className='h-[7dvh] w-full flex items-end absolute'>
                        <div className="flex justify-between mt-0 px-5">
                              <button type="button" onClick={() => router.back()} className="btn bg-[#e21893] text-white px-3! py-1!">
                                    <ChevronLeft className='mr-[1px]' size={20} color='white' />
                              </button>
                        </div>
                  </div>

                  <div className='h-[99dvh] w-full flex items-center'>

                        <div className="w-full">

                              <div className="flex mt-10">
                                    <div className="w-[75%] sm:w-[65%] lg:w-[50%] mx-auto">
                                          <BlockSection title="How To Order" imageUrl="/assets/images/email-verify.png">
                                                <Heading>Email Verification</Heading>
                                                <p className="pb-5 text-center font-bold! text-[12px]">
                                                      Verification Code Sent To
                                                      <span className='font-bold! text-[12px] text-blue-700 mx-1'>{registrationObj.email}</span> <br />
                                                      Please Enter The Code Below <br /><br />
                                                      Incorrect Email? Go Back To Make Change

                                                </p>
                                          </BlockSection>
                                    </div>
                              </div>


                              <div className="">

                                    <AlertMessage2 />

                                    <div className="w-[75%] sm:w-[65%] lg:w-[50%] mx-auto">

                                          <div className="w-full mt-2">
                                                <LabelInput value={registrationObj.verificationCode} label='Verification Code' type='number'
                                                      onChange={(v) => setRegistrationObj((d) => { d.verificationCode = v })} />
                                          </div>

                                          <div className="w-full mt-6 text-end">
                                                <button onClick={handleNext} className="btn bg-[#e21893] text-white br-5 w-full"> Next </button>
                                          </div>

                                    </div>

                              </div>
                        </div>

                  </div>
            </div>
      )
}

export default EmailVerifyPage


