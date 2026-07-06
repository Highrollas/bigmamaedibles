'use client'

import AlertMessage2 from '@/app/components/client/AlertMessage2'
import BillingAddress from '@/app/components/client/BillingAddress'
import useRegistrationStore from '@/app/hooks/auth/register'
import { BillingObj } from '@/Interface'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React, { useEffect } from 'react'

const RegAddressPage = () => {

      const { registrationObj, setRegistrationObj, regStage, setRegStage, isBillingObjValid } = useRegistrationStore();

      useEffect(() => {
            if (regStage !== "address") redirect("/account/register");
      }, []);

      const setBillingObj = (updater: (prev: BillingObj) => void) => {
            setRegistrationObj((state) => {
                  updater(state.billingObj);
            });
      };

      const continueReg = () => {
            setRegStage("profile-image");
            redirect("/account/register/profile-image");
      }

      return (

            <div className='auth-screen bg-auth'>

                  <div className='auth-card auth-card-wide text-center'>

                        <div className="mb-5 text-center">
                              <Image className='auth-icon' height="90" width="90" src="/assets/images/address-image.png" alt="address image" />
                        </div>

                        <h1 className='auth-title'>Delivery Details</h1>

                        <div className="auth-help font-bold! mt-4">
                              These Details Will Be Saved Onto Your Account <br />
                              Making It Easier And Quicker To Place Your Orders
                        </div>

                        <AlertMessage2 />

                        <div className='mt-3'>
                              <BillingAddress hideEmail={true} showNickname={true} billingObj={registrationObj.billingObj} setBillingObj={setBillingObj} />
                        </div>

                        <div className='mt-5 text-end'>
                              {isBillingObjValid && <button onClick={() => continueReg()} className='btn'>Continue</button>}
                        </div>
                  </div>

            </div>

      )
}

export default RegAddressPage

