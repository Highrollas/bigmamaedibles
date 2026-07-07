'use client'

import FallbackImage from '@/app/components/client/FallbackImage';
import Link from 'next/link'
import React from 'react'
import CartCount from '@/app/components/client/CartCount';
import { MENU_CATEGORIES, MENU_QUICK_LINKS, USER_MENU_LINKS } from '@/constants';
import MenuControl from '@/app/components/client/MenuControl';
import Image from 'next/image';
import useSessionStore from '@/app/hooks/auth/user';
import { isPWA } from '@/app/Helper';
import APIClient from '@/app/services/apiClient';

const Menu = () => {

      const { user, clearSession } = useSessionStore();

      const handleLogout = async () => {
            await new APIClient('auth/logout').post({});
            clearSession();
            setTimeout(() => location.reload(), 1000);
      }

      return (

            <>

                  <MenuControl />

                  <div className="w-full my-1.5">

                        <div className='w-full fixed bottom-0 sm:bottom-2 z-[999999999]'>

                              <div className={`w-[100%] sm:w-[60%] bg-white mx-auto flex justify-between items-center sm:rounded-2xl px-6 py-5 ${isPWA() ? 'pb-8' : ''}`}
                                    style={{ boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.08)' }}>

                                    <div className='no-arrow'>
                                          {/* {!loading && */}
                                          <>
                                                {user
                                                      ?
                                                      <label htmlFor="user-drawer" className="cursor-pointer">
                                                            <Image src={'/assets/images/' + (user.avatar) + '.png'} className='h-10 w-auto mt-[-9px]' alt="user icon" width="250" height="250" />
                                                      </label>
                                                      :
                                                      <Link href="/account/login">
                                                            <Image src={'/assets/images/user.png'} className='h-8 w-8' alt="user icon" width="250" height="250" />
                                                      </Link>
                                                }
                                          </>
                                          {/* } */}
                                    </div>

                                    <div className='no-arrow'>
                                          <Link href="/" className='hover:no-underline! cursor-pointer' title="Home">
                                                <Image className='h-7 w-7' src='/assets/images/home-icon.png' height="250" width="250" alt='Home' />
                                          </Link>
                                    </div>
                                    <div className='no-arrow'>
                                          <label htmlFor="category-drawer" className='hover:no-underline! cursor-pointer'>
                                                <Image className='h-7 w-7' src='/assets/images/category-icon.png' height="250" width="250" alt='Category' />
                                          </label>
                                    </div>
                                    <div className='hover:no-underline! relative'>
                                          <Link href='/cart' className='cursor-pointer'>
                                                <Image className='h-7 w-7' src='/assets/images/cart-box.png' height="250" width="250" alt='Cart' />
                                                <CartCount />
                                          </Link>
                                    </div>
                                    <div>
                                          <label htmlFor="explore-drawer" className='hover:no-underline! cursor-pointer'>
                                                <Image className='h-7 w-7' src='/assets/images/explore-icon.png' height="250" width="250" alt='Explore' />
                                          </label>
                                    </div>

                              </div>
                        </div>
                  </div>

                  <div className="drawer">
                        <input id="category-drawer" type="checkbox" className="drawer-toggle" />
                        <div className="drawer-side z-10">

                              <ul className="menu bg-base-200 text-base-content h-[100dvh] w-[100%] sm:w-[40%]  lg:w-[30%] px-4 py-1">

                                    {/* <div className='mt-3'>
                                          <label  htmlFor="shop-drawer" className='flex items-center opacity-60 cursor-pointer'>
                                                <ChevronLeft className='me-1' size={15} /> Shop
                                          </label>
                                    </div> */}

                                    <div className="flex flex-wrap justify-between mt-0">
                                          {
                                                MENU_CATEGORIES.map((c, i) =>
                                                      <Link title={c.name + ' Category'} href={'/product-category/' + c.slug} className="font-bold! cursor-pointer w-[30%] mt-4" key={i}>
                                                            <div className='flex items-center cursor-pointer z-[1000] close-category-drawer menu-item-btn py-4'>

                                                                  {c.imageUrl
                                                                        ? <Image height={250} width={250} src={c.imageUrl} alt={c.name + ' Category'} className='h-[60px] w-auto' />
                                                                        : <div className='text-[50px] leading-[60px]!'>{c.emoji}</div>
                                                                  }
                                                                  <div className='mt-4 text-[90%]'> {c.name} </div>
                                                            </div>
                                                      </Link>
                                                )
                                          }
                                    </div>
                              </ul>
                        </div>
                  </div>

                  <div className="drawer">
                        <input id="explore-drawer" type="checkbox" className="drawer-toggle" />
                        <div className="drawer-side z-10">

                              <ul className="menu bg-base-200 text-base-content h-[100dvh] w-[100%] sm:w-[40%]  lg:w-[30%] px-4 py-1">

                                    {/* <div className='mt-3'>
                                          <label htmlFor="explore-drawer" className='flex items-center opacity-60 cursor-pointer'>
                                                <ChevronLeft className='me-1' size={15} /> Explore
                                          </label>
                                    </div> */}

                                    <div className="flex flex-wrap justify-between mt-0">

                                          {
                                                MENU_QUICK_LINKS.map((m, i) =>
                                                      <React.Fragment key={i}>
                                                            {m.pwaOnly && !isPWA() ? null :
                                                                  <Link title={m.name + ' Category'} href={m.url} className="font-bold! cursor-pointer w-[30%] mt-4">
                                                                        <div className='flex items-center cursor-pointer z-[1000] close-explore-drawer menu-item-btn py-4'>
                                                                              {m.imageUrl
                                                                                    ? <Image height={250} width={250} src={m.imageUrl} alt={m.name + ' Category'} className='h-[60px] w-auto' />
                                                                                    : <div className='text-[40px]'>{m.emoji}</div>
                                                                              }
                                                                              <div className='mt-4 text-[90%]'> {m.name} </div>
                                                                        </div>
                                                                  </Link>
                                                            }
                                                      </React.Fragment>
                                                )
                                          }

                                    </div>
                              </ul>
                        </div>
                  </div>

                  <div className="drawer">
                        <input id="user-drawer" type="checkbox" className="drawer-toggle" />
                        <div className="drawer-side z-10">

                              <ul className="menu bg-base-200 text-base-content h-[100dvh] w-[100%] sm:w-[40%]  lg:w-[30%] px-4 pt-12">

                                    {/* <label htmlFor="user-drawer" className='flex justify-end p-2 pr-4 cursor-pointer'>
                                          <XIcon color='white' size={30} />
                                    </label> */}

                                    <div className='flex flex-col justify-center items-center'>
                                          <FallbackImage src={'/assets/images/' + user?.avatar + '.png'} className='mt-5' alt="user icon" width="150" height="150" />
                                          <div className='font-bold! text-black mt-2 text-[120%]'>@{user?.username}</div>
                                    </div>

                                    <div className="absolute bottom-23 flex flex-wrap justify-between mt-7 w-[92%]">

                                          {
                                                USER_MENU_LINKS.map((m, i) =>
                                                      <Link title={m.name + ' Category'} href={m.slug} className="font-bold! cursor-pointer w-[30%] mt-4" key={i}>
                                                            <div className='flex items-center cursor-pointer close-user-drawer z-[1000] menu-item-btn py-4'>
                                                                  {m.imageUrl
                                                                        ? <Image height={250} width={250} src={m.imageUrl} alt={m.name} className='h-[60px] w-auto' />
                                                                        : <div className='text-[40px]'>{m.emoji}</div>
                                                                  }
                                                                  <div className='mt-4 text-[90%]'> {m.name} </div>
                                                            </div>
                                                      </Link>
                                                )
                                          }

                                          <div className="font-bold! cursor-pointer w-[30%] mt-4">
                                                <div onClick={() => handleLogout()} className='flex items-center cursor-pointer close-user-drawer z-[1000] menu-item-btn py-4'>
                                                      <label className='cursor-pointer'>
                                                            <div className='text-[40px]'>🚪</div>
                                                      </label>
                                                      <div className='mt-4 text-[90%]'> Logout </div>
                                                </div>
                                          </div>

                                    </div>
                              </ul>
                        </div>
                  </div>
            </>
      )
}

export default Menu

