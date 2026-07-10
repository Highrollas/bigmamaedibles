'use client'

import React, { useEffect } from 'react'
import ChatList from '../components/client/chat/ChatList'
import useChatsStore from '../hooks/store/Chat'
import ChatRoom from '../components/client/chat/ChatRoom'
import Image from 'next/image'
import useSessionStore from '../hooks/auth/user'
import { redirect } from 'next/navigation'

const ChatRoomPage = () => {

      const { user, loading } = useSessionStore();
      const { chats, init, openRoom } = useChatsStore()

      useEffect(() => {

            if (!user && !loading) {
                  return redirect("/account/login?redirect=/chat-rooms");
            }

            if (chats.length === 0) init();

      }, [chats, init, user, loading])

      if (chats.length === 0) {
            return (
                  <div className="absolute top-0 left-0 flex h-[100dvh] w-full items-center justify-center bg-white">
                        <span className="loading loading-spinner h-5 w-5"></span>
                  </div>
            )
      }

      return (
            <div className="relative flex h-[100dvh] w-full overflow-hidden">
                  {/* Left side list */}
                  <div className="h-[100dvh] w-full border-r border-gray-500 sm:w-[40%] lg:w-[30%] relative">
                        <Image src="/assets/images/chat-room/chatroom-banner.png" alt='chatroom banner' className='h-[12vh] w-full' height={1000} width={1000} />
                        <div className='h-[12vh] w-full absolute top-0 left-0 flex items-center justify-center text-white font-bold!'>
                              💬 Big Mamas Edibles Chat Rooms
                        </div>
                        <div className="h-[88vh] overflow-y-auto pt-3">
                              <ChatList chats={chats} />
                        </div>
                  </div>

                  {/* Right side room – rendered but slides */}
                  <div
                        className={`
          fixed right-0 top-0 h-[100dvh] w-full bg-white
          sm:relative sm:w-[60%] lg:w-[70%]
          transform transition-transform duration-300 ease-in-out
          ${openRoom ? 'translate-x-0' : 'translate-x-full sm:translate-x-0'}
        `}
                  >
                        <ChatRoom />
                  </div>
            </div>
      )
}

export default ChatRoomPage


