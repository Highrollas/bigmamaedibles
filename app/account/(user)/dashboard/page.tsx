'use client'

import { ChevronLeft } from 'lucide-react';
import { copyToClipboard } from '@/app/Helper'
import useSessionStore from '@/app/hooks/auth/user'
import { CURRENCY_SYMBOL } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const DashboardPage = () => {

      const { user } = useSessionStore();

      return (
            <div className='w-[85%] mx-auto pb-8'>

                  <div className="flex justify-between mt-10">
                        <Link href='/' className="btn bg-[#e21893] text-white px-3! py-1!"><ChevronLeft size={20} color='white' /></Link>
                  </div>

                  <div className="w-full mt-2 text-center">
                        <Image className='mx-auto' src='/assets/images/coupon.png' width={100} height={100} alt='Coupon' />
                        <div className='mt-3'><strong className='text-[1.33rem]'>My Balance</strong></div>
                  </div>

                  <div className="mt-5 flex justify-between border-[3.5px] rounded-[7px] py-[5px] px-[10px]">
                        <div className="flex flex-col font-bold! text-[14px] leading-[17px]!">
                              <span>Account Balance -</span>
                              <span>@{user?.username}</span>
                        </div>
                        <div className="flex items-center">
                              <strong className='text-[130%]!'>{CURRENCY_SYMBOL}{user?.balance}</strong>
                        </div>
                  </div>

                  <div className='text-center mt-4'>
                        <strong className="heading-text">Want To Increase Your Balance ? 😏</strong>
                  </div>

                  <div className='mt-4'>
                        <Image className='w-full' src="/assets/images/dashboard-hero.png" alt='dashboard image' width={300} height={200} />
                  </div>

                  <div className="text-[70%] font-bold! text-center leading-[18px]! mt-2">
                        Dont Smoke Alone. Share Your Unique Referral
                        Link With Friends And Family. When They Create An Account And
                        Place There First Order Over £50 They Receive £10 Off.
                        But Thats Not All… We Will Also Add £10 To Your Balance
                        So Everybody Wins.&nbsp;T&amp;C&nbsp;Apply
                  </div>

                  <div className="w-full mt-4">
                        <div className="form-box-2 rounded-[5px]!">
                              <div className="input-prepend justify-center! bg-[#e21893]! w-[20%]! cursor-pointer">
                                    <Image src='/assets/images/input-coupon.png' alt='coupon icon' width={25} height={25} />
                              </div>
                              <input readOnly value={user?.coupon} className='text-center w-[80%] font-bold!' />
                              <div onClick={() =>
                                    copyToClipboard(`${user?.username} Has Invited You To Create A High Rollas Account 🍃 You Get £10 Of Your First Order Over £50 By Clicking The Link Below 👇🏻 
https://highrollas.cc/account/register?coupon=${user?.coupon}`, 'Your Referral Link Has Been Copied.You Can Now Share It With Your Friends And Family')}
                                    className="input-append w-[20%]! cursor-pointer">
                                    <Image src='/assets/images/upload.png' alt='coupon icon' width={20} height={25} />
                              </div>
                        </div>
                  </div>

            </div>

      )
}

export default DashboardPage


