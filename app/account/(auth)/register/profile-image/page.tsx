'use client'

import ProfileAvatarSelector from '@/app/components/client/ProfileAvatarSelector';
import useRegistrationStore from '@/app/hooks/auth/register';
import useSessionStore from '@/app/hooks/auth/user';
import useAlertStore from '@/app/hooks/store/alert';
import APIClient from '@/app/services/apiClient';
import { UserObj } from '@/Interface';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react'

const RegProfileImageSelectPage = () => {

      const { registrationObj, setRegistrationObj, regStage, setRegStage } = useRegistrationStore();
      const { setMessage2 } = useAlertStore();

      const { setUserSession } = useSessionStore()

      useEffect(() => {
            if (regStage != "profile-image") return redirect("/account/register");
      }, [])

      const handleUserRegistration = async () => {

            setMessage2("loading");

            const resp = await new APIClient<{ status: string; message: string, user: UserObj }>('auth/register/create').post({ ...registrationObj });
            if (resp.status === "success") {

                  setUserSession(resp.user);
                  redirect("/account/dashboard");

            } else {
                  setMessage2(resp.message, "error");
            }

      }

      return (

            <div className='w-[90%] sm:w-[70%] lg:w-[55%] mx-auto text-center'>

                  <div className="flex justify-between mt-10">
                        <button className="btn bg-black text-white px-3! py-1!"
                              onClick={() => {
                                    setRegStage('address');
                                    redirect('/account/register/address');
                              }}>Back</button>
                        <button onClick={handleUserRegistration} className="btn bg-black text-white px-3! py-1!">Next</button>
                  </div>

                  <ProfileAvatarSelector
                        selectedAvatarAlias={registrationObj.avatar}
                        setSelectedAvater={(v) => setRegistrationObj(d => { d.avatar = v })} />

            </div>
      )

}

export default RegProfileImageSelectPage
