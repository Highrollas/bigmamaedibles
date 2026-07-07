'use client'

import AlertMessage2 from '@/app/components/client/AlertMessage2';
import LabelInput from '@/app/components/client/LabelInput'
import { isPWA } from '@/app/Helper';
import useSessionStore from '@/app/hooks/auth/user';
import useAlertStore from '@/app/hooks/store/alert';
import APIClient from '@/app/services/apiClient';
import { UserObj } from '@/Interface';
import Image from 'next/image'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { X } from 'lucide-react';


const LoginPage = () => {
      const [showAuthRequiredModal, setShowAuthRequiredModal] = useState(false);

      const [loginObj, setloginObj] = useImmer({ username: "", password: "" });
      const { setModalMessage, setMessage2 } = useAlertStore();
      const { setUserSession } = useSessionStore()

      useEffect(() => {
            const timeoutId = window.setTimeout(() => {
                  const params = new URLSearchParams(window.location.search);
                  setShowAuthRequiredModal(params.get('authRequired') === '1');
            }, 0);

            return () => window.clearTimeout(timeoutId);
      }, []);


      const handleLogin = async () => {

            if (loginObj.username === "") {
                  return setModalMessage("Kindly Input Your Username To Continue");
            }

            if (loginObj.password === "") {
                  return setModalMessage("Kindly Input Your Password");
            }

            setMessage2("loading");

            const resp = await new APIClient<{ status: string; message: string, user: UserObj }>('auth/login').post({ ...loginObj, isPWA: isPWA() });
            if (resp.status === "success") {
                  setMessage2("Login Successful, Loading…");
                  setUserSession(resp.user);
                  setTimeout(() => {
                        location.href = "/";
                  }, 2000);
            } else {
                  setMessage2(resp.message, "error");
            }

      }

      return (

            <div className='h-screen w-full bg-auth'>

                  {showAuthRequiredModal && (
                        <div className="fixed inset-0 z-[9999999999999999] bg-black/40 flex items-center justify-center px-3">
                              <div className="w-full max-w-[420px] rounded-[22px] bg-[#efefef] p-5 text-center relative" style={{ zoom: .9 }}>
                                    <div
                                          onClick={() => setShowAuthRequiredModal(false)}
                                          className="absolute right-4 top-4 h-7 w-7 rounded-[8px] bg-black text-white flex items-center justify-center"
                                    >
                                          <X className="h-5 w-5 text-white" />
                                    </div>

                                    <h2 className="mt-8 text-2xl font-bold">Hi 😄</h2>

                                    <p className="mt-5 text-[12px] px-2">
                                          Moving Forward All Users Are Required To Have An Account To Use Our Services, This Only Takes A Minute To Setup 😎
                                    </p>

                                    <p className="mt-3 text-[12px] px-2">
                                          We Do Not Spam Promotional Emails Etc, You Can Also Delete Your Account Whenever You Want
                                    </p>
                              </div>
                        </div>
                  )}

                  <div className='h-[99vh] w-full flex items-center'>

                        <div className='w-full'>

                              <div className="mb-2">
                                    <Image src="/assets/images/logo-transparent.png" className='mx-auto' height={120} width={120} alt='user image' />
                              </div>

                              <AlertMessage2 />

                              <div className="w-[75%] sm:w-[50%] mx-auto">
                                    <div className='mt-5'>
                                          <LabelInput label='Username' type='text' pre={"@"} value={loginObj.username}
                                                onChange={(v) => setloginObj(d => { d.username = v })} />
                                    </div>

                                    <div className='mt-5'>
                                          <LabelInput label='Password' type='password' value={loginObj.password}
                                                onChange={(v) => setloginObj(d => { d.password = v ? v.trim() : "" })} />
                                    </div>

                                    <div className='mt-6'>
                                          <button onClick={() => handleLogin()} className='btn w-full'>Login</button>
                                    </div>

                                    <div className='mt-6 text-center'>
                                          <div>
                                                <Link className='text-blue-700 font-bold text-[90%]' href="/account/register">Create Account</Link>
                                          </div>
                                          <div className='mt-2'>
                                                <Link className='text-blue-700 font-bold text-[90%]' href="/account/reset-password">Reset Password</Link>
                                          </div>
                                          <div className='mt-2'>
                                                <Link className='text-blue-700 font-bold text-[90%]' href="/account/username-reminder">Username Reminder</Link>
                                          </div>
                                    </div>

                              </div>
                        </div>
                  </div>
            </div>

      )
}

export default LoginPage
