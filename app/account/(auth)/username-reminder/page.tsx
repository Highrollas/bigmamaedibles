'use client'

import AlertMessage2 from '@/app/components/client/AlertMessage2';
import LabelInput from '@/app/components/client/LabelInput'
import useAlertStore from '@/app/hooks/store/alert';
import APIClient from '@/app/services/apiClient';
import { UserObj } from '@/Interface';
import { MailIcon } from 'lucide-react';
import Image from 'next/image'
import { useImmer } from 'use-immer';


const UsernameReminderPage = () => {

      const [email, setEmail] = useImmer("");
      const { setMessage2 } = useAlertStore();


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

            <div className='h-[99dvh] w-full flex items-center'>

                  <div className='w-full'>

                        <div className="mb-5">
                              <Image src="/assets/images/username-reminder.png" className='mx-auto' height={120} width={120} alt='user image' />
                        </div>

                        <AlertMessage2 />

                        <div className="w-[75%] sm:w-[50%] mx-auto">
                              <div className='mt-5'>
                                    <LabelInput label='Email' type='text' pre={<MailIcon />} value={email}
                                          onChange={(v) => setEmail(v)} />
                              </div>

                              <div className='mt-6'>
                                    <button onClick={() => sendReminder()} className='btn w-full'>Next</button>
                              </div>

                        </div>
                  </div>
            </div>


      )
}

export default UsernameReminderPage

