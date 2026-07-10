'use client';

import LabelInput from '@/app/components/client/LabelInput';
import AlertMessage2 from '@/app/components/client/AlertMessage2';
import useAlertStore from '@/app/hooks/store/alert';
import APIClient from '@/app/services/apiClient';
import { useImmer } from 'use-immer';
import { useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import BlockSection from '@/app/components/server/BlockSection';
import Heading from '@/app/components/server/partials/Heading';

const ForgotPasswordPage = () => {
      const [step, setStep] = useState<1 | 2 | 3>(1);
      const [stepText, setStepText] = useState('Enter The Email Associated With Your Account');
      const [email, setEmail] = useState('');
      const [code, setCode] = useState('');
      const [passwords, setPasswords] = useImmer({ password: '', confirmPassword: '' });
      const { setMessage2, setModalMessage } = useAlertStore();
      const router = useRouter();

      // Step 1: Request Reset Code
      const handleSendCode = async () => {
            if (!email) return setModalMessage('Enter Your Email Address');
            setMessage2('loading');
            const res = await new APIClient<{ status: string; message: string }>('auth/send-reset-code').post({ email });
            if (res.status === 'success') {
                  setStepText('Enter The Verification Code Sent To Your Email Address');
                  setMessage2('Email Address Found');
                  setStep(2);
            } else {
                  setMessage2(res.message, 'error');
            }
      };

      // Step 2: Verify Code
      const handleVerifyCode = async () => {
            if (!code) return setModalMessage('Enter The Verification Code Sent To Your Email Address');
            setMessage2('loading');
            const res = await new APIClient<{ status: string; message: string }>('auth/verify-reset-code').post({ email, verificationCode: code });
            if (res.status === 'success') {
                  setMessage2('Verification Code Is Valid');
                  setStepText('Enter Your New Password Below');
                  setStep(3);
            } else {
                  setMessage2(res.message, 'error');
            }
      };

      // Step 3: Reset Password
      const handleResetPassword = async () => {
            if (!passwords.password || !passwords.confirmPassword) {
                  return setModalMessage('Both Password Fields Are Required');
            }
            if (passwords.password !== passwords.confirmPassword) {
                  return setModalMessage("Passwords Don't Match");
            }

            setMessage2('loading');
            const res = await new APIClient<{ status: string; message: string }>('auth/reset-password').post({
                  email,
                  verificationCode: code,
                  newPassword: passwords.password,
            });

            if (res.status === 'success') {
                  setMessage2('Password Reset Successfully');
                  setTimeout(() => {
                        redirect('/account/login');
                  }, 1500);
            } else {
                  setMessage2(res.message, 'error');
            }
      };

      return (
            <div>

                  <div className='h-[7dvh] w-full flex items-end absolute'>
                        <div className="flex justify-between mt-0 px-5">
                              <button type="button" onClick={() => router.back()} className="btn bg-[#e21893] text-white px-3! py-1!"><ChevronLeft size={20} color='white' /></button>
                        </div>
                  </div>

                  <div className='h-[99dvh] w-full flex items-center'>

                        <div className='w-full'>

                              <div className="flex my-10">
                                    <div className="w-[75%] sm:w-[65%] lg:w-[50%] mx-auto">
                                          <BlockSection title="How To Order" imageUrl="/assets/images/forgot-password.png">
                                                <Heading>Forgot Password</Heading>
                                                <p className="pb-5 text-center font-bold! text-[12px]">
                                                      {stepText}
                                                </p>
                                          </BlockSection>
                                    </div>
                              </div>

                              <AlertMessage2 />

                              <div className="w-[75%] sm:w-[65%] lg:w-[50%] mx-auto">

                                    {step === 1 && (
                                          <>
                                                <LabelInput label="Email" type="email" value={email} onChange={setEmail} />
                                                <button className="btn mt-4 w-full" onClick={handleSendCode}>
                                                      Next
                                                </button>
                                          </>
                                    )}

                                    {step === 2 && (
                                          <>
                                                <LabelInput label="Verification Code" type="text" value={code} onChange={setCode} />
                                                <button className="btn mt-4 w-full" onClick={handleVerifyCode}>
                                                      Next
                                                </button>
                                          </>
                                    )}

                                    {step === 3 && (
                                          <>
                                                <div>
                                                      <LabelInput
                                                            label="New Password"
                                                            type="password"
                                                            value={passwords.password}
                                                            onChange={(v) => setPasswords((d) => { d.password = v })}
                                                      />
                                                </div>
                                                <div className='mt-3'>
                                                      <LabelInput
                                                            label="Confirm Password"
                                                            type="password"
                                                            value={passwords.confirmPassword}
                                                            onChange={(v) => setPasswords((d) => { d.confirmPassword = v })}
                                                      />
                                                </div>
                                                <button className="btn mt-4 w-full" onClick={handleResetPassword}>
                                                      Reset Password
                                                </button>
                                          </>
                                    )}
                              </div>
                        </div>
                  </div>
            </div>
      );
};

export default ForgotPasswordPage;

