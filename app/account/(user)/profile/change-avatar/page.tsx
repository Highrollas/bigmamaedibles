'use client'

import { ChevronLeft } from 'lucide-react';

import ProfileAvatarSelector from '@/app/components/client/ProfileAvatarSelector';
import useSessionStore from '@/app/hooks/auth/user'
import useAlertStore from '@/app/hooks/store/alert';
import APIClient from '@/app/services/apiClient';
import { redirect } from 'next/navigation';
import React from 'react'


interface Resp {
      status: string;
      message: string;
}


const ChangeUserAvatar = () => {

      const { user, setUserObj } = useSessionStore();
      const { setMessage2 } = useAlertStore();


      const saveChanges = async () => {

            if (user?.avatar === "") {
                  return setMessage2("Kindly Select Avatar", "error");
            }

            setMessage2("loading");

            const resp = await new APIClient<Resp>("user/update").post({ avatar: user?.avatar });
            if (resp.status === "success") {
                  setMessage2("Avatar Successfully Changed");
                  setTimeout(() => {
                        redirect('/account/profile');
                  }, 500);
                  return
            }

            return setMessage2(resp.message, "error");

      }

      if (!user) return null

      return (
            <div className='w-[90%] sm:w-[70%] lg:w-[55%] mx-auto text-center'>

                  <div className="flex justify-between mt-10">
                        <button className="btn bg-[#e21893] text-white px-3! py-1!"
                              onClick={() => {
                                    redirect('/account/profile');
                              }}> <ChevronLeft className='mr-[1px]' size={20} color='white' /></button>
                        <button onClick={() => saveChanges()} className="btn bg-[#e21893] text-white px-3! py-1!">Next</button>
                  </div>

                  <ProfileAvatarSelector
                        selectedAvatarAlias={user.avatar}
                        setSelectedAvater={(v) => {
                              setUserObj(d => { d.avatar = v });
                        }} />

            </div>
      )
}

export default ChangeUserAvatar


