'use client';

import LabelInput from '@/app/components/client/LabelInput';
import APIClient from '@/app/services/apiClient';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useRef, useState } from 'react';

const redButtonClass = 'flex h-[42px] w-full items-center justify-center rounded-[5px] bg-[#ff0000]! p-0! text-[80%] font-bold text-white [zoom:1]! hover:bg-[#dc0000]! focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600';

export default function DeleteAccountPage() {
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');
      const [submitting, setSubmitting] = useState(false);
      const dialogRef = useRef<HTMLDialogElement>(null);
      const requestPending = useRef(false);

      const confirmDeletion = (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setError('');
            if (!password) {
                  setError('Please Enter Your Password');
                  return;
            }
            dialogRef.current?.showModal();
      };

      const deleteAccount = async () => {
            if (requestPending.current) return;
            requestPending.current = true;
            setSubmitting(true);
            setError('');

            try {
                  const response = await new APIClient<{ status: string; message: string }>('user/delete-account').post({ password });
                  if (response.status !== 'success') {
                        dialogRef.current?.close();
                        setError(response.message);
                        return;
                  }

                  localStorage.removeItem('user');
                  localStorage.removeItem('guest_user');
                  localStorage.removeItem('guest');
                  window.location.replace('/');
            } catch {
                  dialogRef.current?.close();
                  setError('Unable To Complete Your Request. Please Try Again.');
            } finally {
                  requestPending.current = false;
                  setSubmitting(false);
            }
      };

      return (
            <div className="mx-auto w-[85%] pb-16">

                  <div className="mt-10 flex">
                        <Link href="/account/profile" aria-label="Back to profile" className="btn bg-[#e21893] text-white px-3! py-1!">
                              <ChevronLeft size={20} color="white" />
                        </Link>
                  </div>

                  <Image src="/assets/images/delete-account.png" alt="Delete account" width={320} height={320} priority className="mx-auto mt-8 h-auto w-full object-contain" />

                  <form onSubmit={confirmDeletion} className="mx-auto mt-8 w-[80%]">
                        <h1 className="text-center text-base font-bold leading-relaxed sm:text-lg">
                              Please Enter Your Password To Confirm You Would Like To Delete Your Account
                        </h1>
                        <div className="mt-8">
                              <LabelInput label="Password" type="password" value={password} onChange={setPassword} />
                        </div>
                        {error && <p role="alert" className="mt-4 text-center text-sm text-red-600">{error}</p>}
                        <button type="submit" disabled={submitting} className={`${redButtonClass} mt-8`}>
                              Delete Account
                        </button>
                  </form>

                  <dialog style={{ zoom: '0.8' }} ref={dialogRef} aria-labelledby="delete-account-confirmation" onCancel={event => { if (requestPending.current) event.preventDefault(); }} className="fixed inset-0 m-auto w-[90%] max-w-md rounded-lg border-0 bg-white p-6 text-black shadow-xl backdrop:bg-black/50">
                        <h2 id="delete-account-confirmation" className="text-center text-base font-bold leading-relaxed">
                              Are You Sure You Would Like To Delete Your Account And Wipe All Data Associated With It?
                        </h2>
                        <div className="mt-8 flex justify-between gap-6">
                              <button type="button" disabled={submitting} onClick={() => dialogRef.current?.close()} className="h-[42px] min-w-24 rounded-[5px] bg-black! px-5! py-0! text-sm font-bold text-white [zoom:1]!">
                                    Cancel
                              </button>
                              <button type="button" disabled={submitting} onClick={deleteAccount} className={`${redButtonClass} w-auto! min-w-24 px-5!`}>
                                    {submitting ? 'Deleting...' : 'Delete'}
                              </button>
                        </div>
                  </dialog>
            </div>
      );
}
