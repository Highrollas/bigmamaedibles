/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'
import { truncate } from '@/app/Helper'
import { useSwipeable } from 'react-swipeable'
import { MoreHorizontal, BellOff, ImageIcon } from 'lucide-react'
import { ChatObj } from '@/Interface'
import useChatsStore from '@/app/hooks/store/Chat'
import Image from 'next/image'

interface Props {
      chat: ChatObj
      onEllipsis: () => void
      openSwipe: ChatObj
      onSwipeOpen: (noChat?: boolean) => void
}

const ChatRow = ({ chat, onEllipsis, openSwipe, onSwipeOpen }: Props) => {

      const [offsetX, setOffsetX] = useState(0)
      const startOffsetRef = useRef(0)
      const { setChat, isChatMuted } = useChatsStore()

      const SMALL_REVEAL = 60
      const MIN_OPEN = 40
      const ellipsisWidth = 60

      const closeSwipe = () => setOffsetX(0);

      useEffect(() => {

            if (openSwipe?._id != chat?._id) closeSwipe();

      }, [openSwipe, chat]);

      const handlers = useSwipeable({
            trackMouse: true,
            onSwipeStart: () => (startOffsetRef.current = offsetX),
            onSwiping: (e: any) => {
                  const candidate = startOffsetRef.current + e.deltaX
                  const next = Math.max(Math.min(candidate, 0), -SMALL_REVEAL)
                  setOffsetX(next)
            },
            onSwiped: (e: any) => {
                  const final = Math.max(
                        Math.min(startOffsetRef.current + e.deltaX, 0),
                        -SMALL_REVEAL
                  )
                  const absFinal = Math.abs(final)
                  setOffsetX(absFinal >= MIN_OPEN ? -SMALL_REVEAL : 0)
                  onSwipeOpen();
            },
      })

      const revealed = Math.min(Math.abs(offsetX), SMALL_REVEAL)
      const bgWidth = revealed === 0 ? 0 : SMALL_REVEAL

      const muted = isChatMuted(chat._id)
      const lastMessage = chat.messages[chat.messages.length - 1]

      return (
            <div className="relative overflow-hidden my-4">
                  {/* Swipe background */}
                  <div
                        className="absolute right-0 top-0 h-full flex items-stretch"
                        style={{
                              width: `${bgWidth}px`,
                              transition: 'width 0.1s linear',
                        }}
                  >
                        {/* Ellipsis Button */}
                        <div
                              style={{ width: `${ellipsisWidth}px` }}
                              className="flex items-center justify-center bg-gray-100 cursor-pointer"
                              onClick={() => {
                                    onEllipsis()
                                    closeSwipe()
                              }}
                        >
                              <MoreHorizontal size={20} className="text-gray-600" />
                        </div>
                  </div>

                  {/* Chat preview */}
                  <div
                        {...handlers}
                        className="flex items-center justify-between bg-white p-3 pt-0 select-none cursor-pointer"
                        style={{
                              transform: `translateX(${offsetX}px)`,
                              transition:
                                    offsetX === 0 || Math.abs(offsetX) === SMALL_REVEAL
                                          ? 'transform 200ms ease-out'
                                          : 'none',
                        }}
                        onClick={() => {
                              onSwipeOpen(true);
                              setChat(null);
                              setTimeout(() => setChat(chat), 1);
                        }}
                  >
                        <div className="flex items-center gap-3">
                              <Image
                                    width={50}
                                    height={50}
                                    className="rounded-full"
                                    src={chat.imageUrl}
                                    alt={chat.name}
                              />
                              <div>
                                    <div className="font-bold! flex items-center gap-2">
                                          {chat.name}
                                    </div>
                                    <div className="text-gray-500 text-sm">

                                          {lastMessage?.type === "media"
                                                ? <div className='flex gap-1 items-center'>
                                                      <ImageIcon size={16} />
                                                      <span>
                                                            {lastMessage?.message?.trim()
                                                                  ? truncate(lastMessage.message, 45, 30)
                                                                  : `${lastMessage?.sender.username} sent an image`}
                                                      </span>
                                                </div>
                                                : truncate(lastMessage?.message || '', 45, 30)
                                          }
                                    </div>
                              </div>
                        </div>

                        {/* Bell icon aligned to right (on larger screens) */}
                        {muted && (
                              <BellOff className="w-5 h-5 text-gray-400" />
                        )}
                  </div>
            </div>
      )
}

export default ChatRow

