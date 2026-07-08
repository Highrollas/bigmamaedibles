'use client'

import AlertMessage2 from '@/app/components/client/AlertMessage2'
import LabelInput from '@/app/components/client/LabelInput'
import useAlertStore from '@/app/hooks/store/alert'
import APIClient from '@/app/services/apiClient'
import Image from 'next/image'
import React from 'react'
import { useImmer } from 'use-immer'

const EmailContactForm = () => {

      const [formObj, setFormObj] = useImmer({
            name: "",
            orderId: "",
            email: "",
            message: "",
            formSubmitted: false
      });

      const { setMessage2 } = useAlertStore();

      const handleFormSubmit = async () => {

            if (formObj.name.trim() == "") {
                  setMessage2("Name Is Required", "error");
                  return;
            }

            if (formObj.email.trim() == "") {
                  setMessage2("Email Is Required", "error");
                  return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formObj.email)) {
                  setMessage2("Invalid Email Address", "error");
                  return;
            }

            if (formObj.message.trim() == "") {
                  setMessage2("Message Is Required", "error");
                  return;
            }

            setMessage2("loading");

            const resp = await new APIClient<{ status: "success" | "failed", message: string }>("contact").post({ ...formObj });
            if (resp.status == "success") {
                  setFormObj(d => { d.formSubmitted = true });
            } else {
                  setMessage2(resp.message, "error");
            }

      }

      return (
            <div className='w-[90%] sm:w-[70%] lg:w-[50%] mx-auto mb-12'>


                  <div>
                        <Image className='w-[100%] h-auto mx-auto' src='/assets/images/email-contact.jpg' alt='form image' width={300} height={300} />
                  </div>


                  {formObj.formSubmitted && <div className='p-3 brand-panel text-white mt-10 text-center'>Thanks for contacting us! We will be in touch with you shortly.</div>}


                  {!formObj.formSubmitted &&

                        <div className='mt-10'>

                              <AlertMessage2 />

                              <div className='mt-3'>
                                    <LabelInput label='Name *' type='text' value={formObj.name}
                                          onChange={(v) => setFormObj(d => { d.name = v })} />
                              </div>

                              <div className='mt-5'>
                                    <LabelInput label='Order Number' type='text' value={formObj.orderId}
                                          onChange={(v) => setFormObj(d => { d.orderId = v })} />
                                    <span className='text-[80%] text-gray-600'>Type 0000 If You Have No Order Number</span>
                              </div>

                              <div className='mt-5'>
                                    <LabelInput label='Email *' type='text' value={formObj.email}
                                          onChange={(v) => setFormObj(d => { d.email = v })} />
                              </div>

                              <div className='mt-5'>
                                    <LabelInput label='Message *' type='text' value={formObj.message}
                                          onChange={(v) => setFormObj(d => { d.message = v })} />
                              </div>

                              <div className='mt-5'>
                                    <button onClick={() => handleFormSubmit()} className='btn w-full'>Submit</button>
                              </div>
                        </div>

                  }



            </div>
      )
}

export default EmailContactForm

