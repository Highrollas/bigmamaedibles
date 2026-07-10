'use client'

import AlertMessage2 from '@/app/components/client/AlertMessage2';
import LabelInput from '@/app/components/client/LabelInput'
import useAdminSessionStore from '@/app/hooks/auth/admin';
import useAlertStore from '@/app/hooks/store/alert';
import APIClient from '@/app/services/apiClient';
import { AdminObj, ReqResp } from '@/Interface';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React, { useState } from 'react'
import { useImmer } from 'use-immer';

const AdminLoginPage = () => {

      const [loginObj, setLoginObj] = useImmer<{ email: string, password: string, verificationCode: string }>({
            email: "", password: "", verificationCode: ""
      });
      const [loginLoading, setLoginLoading] = useState(false);
      const [loginLoading2, setLoginLoading2] = useState(false);
      const { setAdminSession } = useAdminSessionStore();
      const [codeRequested, setCodeRequested] = useState(false);

      const { setMessage2 } = useAlertStore();


      const handleLogin = async () => {

            if (loginObj.email === "") {
                  return setMessage2("Kindly Input  A Valid Email", "error");
            }

            if (loginObj.password === "") {
                  return setMessage2("Kindly Input  A Valid Password", "error");
            }

            if (loginObj.verificationCode === "") {
                  return setMessage2("Kindly Input  A Valid Verification", "error");
            }

            setLoginLoading(true);

            const resp = await new APIClient<ReqResp & { admin: AdminObj }>('admin/auth/login').post({ ...loginObj });
            if (resp.status === "success") {

                  setMessage2("Login Successful");
                  setAdminSession(resp.admin);
                  redirect("/admin/dashboard");

            } else {
                  setMessage2(resp.message, 'error');
            }

            setLoginLoading(false);
      }

      const handleSendVerificationCode = async () => {

            if (loginObj.email.length < 5) {
                  return setMessage2("Enter A Valid Email Sausage 😤", 'error');
            }

            setLoginLoading2(true);

            const resp = await new APIClient<ReqResp>('admin/auth/send-login-code').post({ email: loginObj.email });
            if (resp.status === "success") {
                  setMessage2("Verification Code Successful Sent");
                  setCodeRequested(true);
            } else {
                  setMessage2(resp.message, 'error');
            }

            setLoginLoading2(false);
      }

      return (
            <div className='flex items-center'>
                  <div className="w-[90%] sm:w-[70%] lg:w-[55%] mx-auto card bg-base-100  shadow-sm p-12">

                        <div className="mx-auto mb-3">
                              <Image src='/assets/images/logo.png' className='h-15 w-15 mx-auto rounded' height={250} width={250} alt='Highrollas' />
                        </div>

                        <div className='text-center'>
                              <h1 className='text-2xl'>Highrollas Admin</h1>
                        </div>

                        <AlertMessage2 />

                        <div className='mt-5'>
                              <LabelInput type='email' label='Email' value={loginObj.email}
                                    onChange={(v) => setLoginObj((d) => { d.email = v })} />
                        </div>

                        <div className='mt-5'>
                              <LabelInput type='password' label='Password' value={loginObj.password}
                                    onChange={(v) => setLoginObj((d) => { d.password = v })} />
                        </div>

                        <div className='mt-5'>
                              <div className='float-label-right cursor-pointer'
                                    onClick={() => handleSendVerificationCode()}>
                                    Send Code
                                    {loginLoading2 && <span className="loading loading-spinner w-3 h-3 ms-2 border-white"></span>}
                              </div>
                              <LabelInput type='text' label='Verification Code' value={loginObj.verificationCode}
                                    onChange={(v) => setLoginObj((d) => { d.verificationCode = v })} />
                        </div>


                        <div className='mt-5'>
                              <button disabled={loginLoading || !codeRequested} className='btn bg-[#e21893] text-white w-full'
                                    onClick={() => handleLogin()}>
                                    Login
                                    {loginLoading && <span className="loading loading-spinner w-5 h-5 border-white"></span>}
                              </button>
                        </div>

                  </div>

            </div >
      )
}

export default AdminLoginPage

