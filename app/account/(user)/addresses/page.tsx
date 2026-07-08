'use client'

import AlertMessage2 from '@/app/components/client/AlertMessage2'
import BillingAddress from '@/app/components/client/BillingAddress'
import DefaultAddress from '@/app/components/client/DefaultAddress'
import useSessionStore from '@/app/hooks/auth/user'
import useAlertStore from '@/app/hooks/store/alert'
import APIClient from '@/app/services/apiClient'
import { EMPTY_BILLING_OBJ } from '@/constants'
import { BillingObj } from '@/Interface'
import { produce } from 'immer'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { useImmer } from 'use-immer'

interface Resp {
      status: string;
      message: string;
}

//work on edit address, delete address, set default address`

const UserAddressPage = () => {

      const { user, setUserObj } = useSessionStore();
      const [actionState, setActionState] = useState<"" | "new" | "edit">("");
      const [billingObj, setBillingObj] = useImmer<BillingObj>(EMPTY_BILLING_OBJ);
      const [originalBillingObj, setOriginalBillingObj] = useImmer<BillingObj>(EMPTY_BILLING_OBJ);
      const { setMessage2, setModalMessage } = useAlertStore();

      const isBillingObjValid = Boolean(
            billingObj.firstName &&
            billingObj.lastName &&
            billingObj.addressObj.country &&
            billingObj.addressObj.city &&
            billingObj.addressObj.street &&
            billingObj.addressObj.postcode &&
            billingObj.addressObj.nickname
      );


      const addNewBillingObj = async () => {

            setMessage2("loading");
            const billingObjArray = [...user!.billingObj, { ...billingObj, email: user!.email }];
            const resp = await new APIClient<Resp>("user/update").post({ billingObj: billingObjArray });

            if (resp.status === "success") {
                  setMessage2("Address Added Successfully");
                  setUserObj(d => { d.billingObj = billingObjArray });
                  setTimeout(() => setActionState(""), 500);
                  return
            }

            return setMessage2(resp.message, "error");
      }

      const saveBillingObjEdit = async () => {

            setMessage2("loading");

            const billingObjArray = [...user!.billingObj];
            const index = billingObjArray.indexOf(originalBillingObj);
            billingObjArray[index] = billingObj;

            const resp = await new APIClient<Resp>("user/update").post({ billingObj: billingObjArray });

            if (resp.status === "success") {
                  setMessage2("Changes Successfully Saved");
                  setUserObj(d => { d.billingObj = billingObjArray });
                  setTimeout(() => setActionState(""), 500);
                  return
            }

            return setMessage2(resp.message, "error");
      }

      const handleBillingObjDelete = async (index: number) => {

            const comfirm = await setModalMessage("Are You Sure You Want To Delete This Address ?", "dialog");

            if (comfirm) {

                  setMessage2("loading");

                  const billingObjArray = user!.billingObj.filter((b, i) => i != index);

                  const resp = await new APIClient<Resp>("user/update").post({ billingObj: billingObjArray });

                  if (resp.status === "success") {
                        setMessage2("Address Deleted Successfully");
                        setUserObj(d => { d.billingObj = billingObjArray });
                        setTimeout(() => setActionState(""), 500);
                        return
                  }

                  return setMessage2(resp.message, "error");

            }

      }

      const makeAddressDefault = async (billingObj: BillingObj) => {
            const index = Number(user?.billingObj.indexOf(billingObj));
            if (index >= 0) {

                  setMessage2("loading");

                  const billingObjArray = produce(user!.billingObj, draft => {
                        draft.forEach(b => {
                              b.default = false;
                        });
                        draft[index].default = true;
                  });

                  const resp = await new APIClient<Resp>("user/update").post({ billingObj: billingObjArray });

                  if (resp.status === "success") {

                        setUserObj(d => { d.billingObj = billingObjArray });

                        setMessage2("Default Address Changed Successfully");
                        setTimeout(() => setActionState(""), 500);
                        return
                  }

                  return setMessage2(resp.message, "error");
            }
      }

      return (
            <div className='w-[90%] mx-auto mb-5'>

                  <div className="flex justify-between mt-10">
                        <Link href='/' className="btn bg-black text-white px-3! py-1!">Back</Link>
                  </div>

                  <div className='mt-5 mb-3 text-center'>
                        <Image alt='delivery' height={60} width={60} className='mx-auto' src="/assets/images/address-image.png" />
                        <div className="mt-3">
                              <strong className='text-[130%]'>Addresses</strong>
                        </div>
                  </div>

                  <div className='mt-4 mb-5 font-bold! text-[80%] text-red-600 text-center leading-[18px]!'>
                        These Details Will Be Saved Onto Your Account
                        Making It Easier And Quicker To Place Your Orders
                  </div>

                  <AlertMessage2 />

                  {
                        actionState === "" &&
                        <>
                              {
                                    user?.billingObj.map((_billingObj, i) =>
                                          <DefaultAddress showDefault={true} showEdit={true} showDelete={true} key={i} billingObj={_billingObj}
                                                onDelete={() => handleBillingObjDelete(i)}
                                                onEdit={() => {
                                                      setActionState("edit");
                                                      setBillingObj(_billingObj);
                                                      setOriginalBillingObj(_billingObj);
                                                }} />
                                    )
                              }

                              <div className='mt-5'>
                                    <button className='btn w-full'
                                          onClick={() => {
                                                setActionState("new");
                                                setBillingObj(EMPTY_BILLING_OBJ);
                                          }}> Add New Address</button>
                              </div>
                        </>
                  }


                  {
                        actionState === "new" &&
                        <>
                              <BillingAddress hideEmail={true} showNickname={true} billingObj={billingObj} setBillingObj={setBillingObj} />
                              <div className='mt-4 flex justify-between'>
                                    <div>
                                          <button className='btn px-3! py-1!'
                                                onClick={() => setActionState("")}>Cancel</button>
                                    </div>
                                    <div>
                                          <button className='btn px-3! py-1!'
                                                disabled={!isBillingObjValid}
                                                onClick={() => addNewBillingObj()}>Done</button>
                                    </div>
                              </div>
                        </>
                  }

                  {
                        actionState === "edit" &&
                        <>
                              <BillingAddress hideEmail={true} showNickname={true} billingObj={billingObj} setBillingObj={setBillingObj} />
                              <div className='mt-4 flex justify-between'>
                                    <div>
                                          <button className='btn px-3! py-1!'
                                                onClick={() => setActionState("")}>Cancel</button>
                                    </div>
                                    <div>
                                          <button className='btn px-3! py-1!'
                                                onClick={() => makeAddressDefault(billingObj)}>Make Default</button>
                                    </div>
                                    <div>
                                          <button className='btn px-3! py-1!'
                                                disabled={!isBillingObjValid}
                                                onClick={() => saveBillingObjEdit()}>Done</button>
                                    </div>
                              </div>
                        </>
                  }

            </div >
      )
}

export default UserAddressPage
