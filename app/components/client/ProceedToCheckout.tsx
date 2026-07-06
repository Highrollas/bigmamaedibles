'use client'

import React, { useEffect, useState } from 'react'
import UpsellProductList from './UpsellProductList';
import Link from 'next/link';
import useCartStore from '@/app/hooks/store/cart';
import useSessionStore from '@/app/hooks/auth/user';
import { ProductObj } from '@/Interface';
import Image from 'next/image';

type action = 'checkout' | 'login';

interface Props {
      accessories: ProductObj[];
      mixers: ProductObj[];
}


const ProceedToCheckout = ({ accessories, mixers }: Props) => {

      const { carts } = useCartStore();
      const [action, setAction] = useState<action>('checkout');
      const [mounted, setMounted] = useState(false);
      const { user } = useSessionStore();

      useEffect(() => {
            setMounted(true);
      }, [])

      if (!mounted) return null;

      if (carts.length === 0) return null;

      const handleSetAction = (a: action) => {

            setAction(a);
            (document.getElementById('cartUpsellModal') as unknown as { showModal: () => void })?.showModal()
      }

      return (
            <div className='flex items-center my-3 gap-2'>

                  {
                        !user &&
                        <div className=''>
                              <Link href="/account/login" className='btn'>
                                    <div className='flex items-center justify-around gap-3'>
                                          <Image src="/assets/images/user-white.png" alt="login" width={20} height={20} />
                                          <div>
                                                Login
                                          </div>
                                          <div>→</div>
                                    </div>
                              </Link>
                        </div>
                  }

                  <div className=''>
                        <button onClick={() => handleSetAction('checkout')}
                              className='btn'>
                              {user ?
                                    <div className='flex items-center justify-around gap-3'>
                                          <Image src="/assets/images/user-white.png" alt="proceed as user" width={20} height={20} />
                                          <div>
                                                Continue
                                          </div>
                                          <div>→</div>
                                    </div>
                                    :
                                    <div className='flex items-center justify-around gap-3'>
                                          <Image src="/assets/images/logo-white-2.png" alt="proceed as guest" width={23} height={23} />
                                          <div>
                                                Guest
                                          </div>
                                          <div>→</div>
                                    </div>
                              }
                        </button>
                  </div>

                  <dialog id="cartUpsellModal" className="modal modal-middle flex justify-center" onClick={e => {
                        // Only close if the user clicked the overlay, not the modal content
                        if (e.target === e.currentTarget) (e.currentTarget as HTMLDialogElement).close();
                  }}>
                        <div className="modal-box p-2 min-w-[80%] w-[80%] sm:min-w-[50%] sm:w-[50%]">
                              <div className='brand-panel border-3 brand-border rounded-[5px]'>
                                    <div className='py-3 w-full text-center rounded-[5px] text-white font-bold!'>
                                          Forgot Something?
                                    </div>
                                    <div className='bg-white rounded-b-[5px]'>
                                          <div className='h-[50vh] overflow-y-auto'>
                                                <UpsellProductList mixers={mixers} accessories={accessories} />
                                          </div>
                                          <div className="modal-action">
                                                <form method="dialog" className='w-full flex justify-center mb-3 px-3'>
                                                      {action === "checkout" && <Link href='/checkout' prefetch className="btn w-full text-white py-4! px-6!">Checkout</Link>}
                                                      {action === "login" && <Link href='/account/login' prefetch className="btn w-full text-white py-4! px-6!">Checkout</Link>}
                                                </form>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </dialog>
            </div>
      )
}

export default ProceedToCheckout

