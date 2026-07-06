'use client'
import React from 'react'
import Image from 'next/image'
import { ChevronLeft } from 'lucide-react'
import { ChatObj } from '@/Interface'
import useChatsStore from '@/app/hooks/store/Chat'

interface ChatHeaderProps {
      chat: ChatObj
      closeRoom: () => void
}

export default function ChatHeader({ chat, closeRoom }: ChatHeaderProps) {

      const { setShowChatInfo } = useChatsStore();

      return (
            <div className="brand-panel text-white flex items-center gap-2 h-[9dvh] sm:h-[12dvh] px-3 cursor-pointer">
                  <div onClick={closeRoom} className="w-10 ps-2 cursor-pointer">
                        <ChevronLeft className="sm:hidden" />
                  </div>
                  <Image onClick={() => setShowChatInfo(chat)}
                        width={100}
                        height={100}
                        className="rounded-full h-10 w-10"
                        src={chat.imageUrl}
                        alt={chat.name}
                  />
                  <div onClick={() => setShowChatInfo(chat)} >
                        <div className="font-bold!">{chat.name}</div>
                  </div>
            </div>
      )
}

