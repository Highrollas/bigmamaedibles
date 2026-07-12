'use client'

import AlertMessage2 from '@/app/components/client/AlertMessage2';
import LabelInput from '@/app/components/client/LabelInput'
import BlockSection from '@/app/components/server/BlockSection';
import useAlertStore from '@/app/hooks/store/alert';
import APIClient from '@/app/services/apiClient';
import { UserObj } from '@/Interface';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useImmer } from 'use-immer';
import Heading from '@/app/components/server/partials/Heading';

const UsernameReminderPage = () => {

      const [email, setEmail] = useImmer("");
      const { setMessage2 } = useAlertStore();
      const router = useRouter();


      const sendReminder = async () => {

            if (email === "") {
                  return setMessage2("Kindly Input Your Email address To Continue", "error");
            }

            setMessage2("loading");

            const resp = await new APIClient<{ status: string; message: string, user: UserObj }>('auth/username-reminder').post({ email });
            if (resp.status === "success") {
                  setMessage2("Your Username Has Been Sent To Your Email");
            } else {
                  setMessage2(resp.message, "error");
            }

      }

      return (

            <div>

                  <div className='h-[7dvh] w-full flex items-end absolute'>
                        <div className="flex justify-between mt-0 px-5">
                              <button type="button" onClick={() => router.back()} className="btn bg-[#e21893] text-white px-3! py-1!"> <ChevronLeft className='mr-[1px]' size={20} color='white' /></button>
                        </div>
                  </div>

                  <div className='h-[99dvh] w-full flex items-center'>

                        <div className='w-full'>


                              <div className="flex mt-10">
                                    <div className="w-[75%] sm:w-[65%] lg:w-[50%] mx-auto">
                                          <BlockSection title="How To Order" imageUrl="/assets/images/username-reminder-ed.png">
                                                <Heading >Username Reminder</Heading>
                                                <p className="pb-5 text-center font-bold! text-[12px]">
                                                      Kindly Enter Email Address Associated With Your Account To Receive Your Username
                                                </p>
                                          </BlockSection>
                                    </div>
                              </div>


                              <AlertMessage2 />

                              <div className="w-[75%] sm:w-[50%] mx-auto">
                                    <div className='mt-5'>
                                          <LabelInput label='Email' type='text' value={email}
                                                onChange={(v) => setEmail(v)} />
                                    </div>

                                    <div className='mt-6'>
                                          <button onClick={() => sendReminder()} className='btn w-full'>Next</button>
                                    </div>

                              </div>
                        </div>
                  </div>

            </div>

      )
}

export default UsernameReminderPage

