'use client'

import { ChevronLeft } from 'lucide-react';

import AlertMessage2 from '@/app/components/client/AlertMessage2';
import FallbackImage from '@/app/components/client/FallbackImage';
import LabelInput from '@/app/components/client/LabelInput';
import useSessionStore from '@/app/hooks/auth/user';
import useAlertStore from '@/app/hooks/store/alert';
import APIClient from '@/app/services/apiClient';
import Link from 'next/link';
import React from 'react'
import { useImmer } from 'use-immer';

interface Resp {
      status: string;
      message: string;
}

const UserProfilePage = () => {

      const { user } = useSessionStore();
      const { setModalMessage, setMessage2 } = useAlertStore();
      const [selectedChange, setSelectedChange] = useImmer<"email" | "password" | "">("");
      const [changeObj, setChangeObj] = useImmer({ email: "", currentPassword: "", newPassword: "" });

      const saveChanges = async () => {

            if (selectedChange === "email") {

                  if (changeObj.email === "") {
                        return setMessage2("Kindly Enter Your New Email", "error");
                  }

                  setMessage2("loading")
                  const resp = await new APIClient<Resp>("user/update").post({ email: changeObj.email });
                  if (resp.status === "success") {
                        return setMessage2("Email Successfully Changed");
                  }

                  return setMessage2(resp.message, "error");

            } else if (selectedChange === "password") {

                  if (changeObj.currentPassword === "") {
                        return setMessage2("Kindly Enter Your Current Password", "error");
                  }

                  if (changeObj.newPassword === "") {
                        return setMessage2("Kindly Enter Your New Password", "error");
                  }

                  setMessage2("loading");
                  const resp = await new APIClient<Resp>("user/update").post({
                        currentPassword: changeObj.currentPassword,
                        password: changeObj.newPassword
                  });

                  if (resp.status === "success") {
                        return setMessage2("Password Successfully Changed");
                  }

                  return setMessage2(resp.message, "error");
            }
      }

      if (!user) return null;


      return (

            <>

                  <div className='w-[85%] mx-auto'>

                        <div className="flex justify-between mt-10">
                              <Link href='/' className="btn bg-[#e21893] text-white px-3! py-1!"> <ChevronLeft className='mr-[1px]' size={20} color='white' /></Link>
                        </div>

                        <div className='flex flex-col justify-center items-center mt-5'>
                              <FallbackImage src={'/assets/images/' + user?.avatar + '.png'} alt="user icon" width="220" height="220" />
                              <Link href="/account/profile/change-avatar" className='mt-2 font-bold! text-[80%]! underline text-blue-600'>Change Avater</Link>
                        </div>

                        <AlertMessage2 />

                        <div className='w-[80%] mx-auto'>

                              <div className='mt-4'>
                                    <div className='mt-5'>
                                          <LabelInput label='Username' type='text' pre={"@"} value={user.username}
                                                onClick={() => setModalMessage("Your Username Is Permanent And Can Not Be Changed")} />
                                    </div>
                              </div>
                              <div className='mt-4'>

                                    {
                                          selectedChange === "email"
                                                ?
                                                <div className='mt-5'>
                                                      <div className='float-label-right cursor-pointer'
                                                            onClick={() => setSelectedChange("")}>Cancel</div>
                                                      <LabelInput label='Enter New Email' type='text' value={changeObj.email}
                                                            onChange={(v) => setChangeObj(d => { d.email = v })} />
                                                </div>
                                                :
                                                <div className='mt-5'>
                                                      <div className='float-label-right cursor-pointer'
                                                            onClick={() => setSelectedChange("email")}>Change Email</div>
                                                      <LabelInput readOnly={true} label='Email' type='text' value={user.email}
                                                      />
                                                </div>
                                    }
                                    {
                                          selectedChange === "password"
                                                ?
                                                <>
                                                      <div className='mt-5'>
                                                            <div className='float-label-right cursor-pointer'
                                                                  onClick={() => setSelectedChange("")}>Cancel</div>
                                                            <LabelInput label='Enter Current Password' type='password' value={changeObj.currentPassword}
                                                                  onChange={(v) => setChangeObj(d => { d.currentPassword = v })} />
                                                      </div>

                                                      <div className='mt-5'>
                                                            <LabelInput label='Enter New Password' type='password' value={changeObj.newPassword}
                                                                  onChange={(v) => setChangeObj(d => { d.newPassword = v })} />
                                                      </div>
                                                </>
                                                :
                                                <div className='mt-5'>
                                                      <div className='float-label-right cursor-pointer'
                                                            onClick={() => setSelectedChange("password")}>Change Password</div>
                                                      <LabelInput readOnly={true} label='Password' type='text' value="************"
                                                      />
                                                </div>
                                    }


                                    {
                                          selectedChange != "" && <div className='mt-5'>
                                                <button className='btn w-full' onClick={() => saveChanges()}>Save Changes</button>
                                          </div>
                                    }

                              </div>


                        </div>

                  </div>

            </>


      )
}

export default UserProfilePage


