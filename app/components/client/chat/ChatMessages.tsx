/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { Shield, Clock, AlertTriangle, CornerDownLeft, Trash2 } from 'lucide-react'
import { ChatMessage, ChatObj, UserObj } from '@/Interface'
import { getProfileAvatarImageUrl } from '@/constants'

interface ChatMessagesProps {
      chat: ChatObj | null
      user: UserObj | null
      setFullscreenImage: ({ chatId, messageObj }: { chatId: string; messageObj: ChatMessage }) => void
      messagesEndRef: any
      showAttachmentMenu: boolean
      keyboardOpen: boolean
      containerRef?: React.RefObject<HTMLDivElement | null>
      setReplyingTo: (msg: ChatMessage | null) => void
}

interface MessageContextMenu {
      messageId: string
      isMe: boolean
      x: number
      y: number
      message: ChatMessage
}

export default function ChatMessages({
      chat,
      user,
      setFullscreenImage,
      messagesEndRef,
      containerRef,
      setReplyingTo,
      showAttachmentMenu
}: ChatMessagesProps) {

      const [contextMenu, setContextMenu] = useState<MessageContextMenu | null>(null)
      const holdTimerRef = useRef<NodeJS.Timeout | null>(null)
      const holdStartPos = useRef<{ x: number; y: number } | null>(null)

      const handleHoldStart = (e: React.TouchEvent | React.MouseEvent, messageId: string, isMe: boolean, message: ChatMessage) => {
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

            holdStartPos.current = { x: clientX, y: clientY }

            holdTimerRef.current = setTimeout(() => {
                  setContextMenu({
                        messageId,
                        isMe,
                        x: clientX,
                        y: clientY,
                        message,
                  })
            }, 350) // 350ms hold duration
      }

      const handleHoldEnd = (e: React.TouchEvent | React.MouseEvent) => {
            if (holdTimerRef.current) {
                  clearTimeout(holdTimerRef.current)
                  holdTimerRef.current = null
            }

            // Check if user moved finger/mouse (swipe/drag detection)
            if (holdStartPos.current && 'changedTouches' in e) {
                  const clientX = e.changedTouches[0].clientX
                  const clientY = e.changedTouches[0].clientY
                  const deltaX = Math.abs(clientX - holdStartPos.current.x)
                  const deltaY = Math.abs(clientY - holdStartPos.current.y)

                  // If moved more than 10px, cancel the hold
                  if (deltaX > 10 || deltaY > 10) {
                        holdStartPos.current = null
                        return
                  }
            }
            holdStartPos.current = null
      }

      const handleReply = (messageId: string) => {
            const message = chat?.messages.find(m => m.id === messageId)
            if (message) {
                  setReplyingTo(message)
            }
            setContextMenu(null)
      }

      const handleKeep = (messageId: string) => {
            // TODO: Implement keep/bookmark functionality
            console.log('Keep message:', messageId)
            setContextMenu(null)
      }

      const handleReport = (messageId: string) => {
            // TODO: Implement report functionality
            console.log('Report message:', messageId)
            setContextMenu(null)
      }

      const handleDelete = (messageId: string) => {
            // TODO: Implement delete functionality
            console.log('Delete message:', messageId)
            setContextMenu(null)
      }

      const formatDateLabel = (dateString: string) => {
            const date = new Date(dateString)
            const today = new Date()
            const yesterday = new Date()
            yesterday.setDate(today.getDate() - 1)
            if (date.toDateString() === today.toDateString()) return 'Today'
            if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
            return date.toLocaleDateString([], {
                  day: 'numeric',
                  month: 'short',
                  year: today.getFullYear() !== date.getFullYear() ? 'numeric' : undefined,
            })
      }

      function MessageRow({
            m,
            i,
            isLastOfBlock,
            isFirstOfBlock,
      }: {
            m: ChatMessage
            i: number
            isLastOfBlock: boolean
            isFirstOfBlock: boolean
      }) {

            const isMe = m.sender.username === user?.username

            const timeText = new Date(m.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
            })

            return (
                  <div
                        key={i}
                        className={`relative chat ${isMe ? 'chat-end' : 'chat-start'} ${isLastOfBlock ? '' : 'mb-[-6.8px]'}`}
                  >
                        {chat?.allowPFP && (
                              <div className="chat-image avatar flex-shrink-0">
                                    {isLastOfBlock ? (
                                          <div className="w-8 rounded-full bg-[#e21893] overflow-hidden">
                                                <Image
                                                      width={100}
                                                      height={100}
                                                      alt={m.sender.username}
                                                      src={getProfileAvatarImageUrl(m.sender.avatar)}
                                                />
                                          </div>
                                    ) : (
                                          <div className="w-8" />
                                    )}
                              </div>
                        )}


                        <div
                              className={`relative break-word max-w-[80%] min-w-[10px] rounded-2xl ${m.type === 'media' ? 'p-[0.3rem]' : 'p-[0.5rem]'} ${isLastOfBlock ? 'chat-bubble' : ''} ${isMe ? 'bg-gray-200 text-black' : 'bg-[#e21893] text-white'} cursor-pointer select-none`}
                              onTouchStart={(e) => handleHoldStart(e, m.id || `${i}`, isMe, m)}
                              onTouchEnd={handleHoldEnd}
                              onTouchMove={() => {
                                    if (holdTimerRef.current) {
                                          clearTimeout(holdTimerRef.current)
                                          holdTimerRef.current = null
                                    }
                              }}
                              onMouseDown={(e) => handleHoldStart(e, m.id || `${i}`, isMe, m)}
                              onMouseUp={handleHoldEnd}
                              onMouseLeave={() => {
                                    if (holdTimerRef.current) {
                                          clearTimeout(holdTimerRef.current)
                                          holdTimerRef.current = null
                                    }
                              }}
                        >

                              {isFirstOfBlock && !isMe && (
                                    <div className="flex items-center gap-1 mb-1 ps-2 pb-2 pt-0.5 text-[80%] font-bold!">
                                          @{m.sender.username}
                                          {m.sender.role === 'admin' && (
                                                <Shield className="w-3 h-3 text-yellow-400" />
                                          )}
                                    </div>
                              )}

                              {m.replyTo && (
                                    <div className={`mb-2 rounded-lg px-2 py-1 text-[11px] w-full min-w-0 ${isMe ? 'bg-gray-300 text-black' : 'bg-[#1a52ac] text-white'}`}>
                                          <div className="font-semibold! text-[10px] opacity-80 truncate min-w-0">
                                                @{m.replyTo.sender}
                                          </div>
                                          <div className="truncate opacity-90 min-w-0 max-w-[217px] font-sanfrancisco">
                                                {m.replyTo.message || '📷 Photo'}
                                          </div>
                                    </div>
                              )}

                              {m.type === 'media' ? (
                                    <div className=''>
                                          <Image
                                                width={200}
                                                height={200}
                                                src={m.mediaUrl || ''}
                                                alt="media"
                                                onClick={() => setFullscreenImage({ messageObj: m, chatId: chat!._id })}
                                                className="w-full rounded-[10px] cursor-pointer hover:opacity-90 transition"
                                          />
                                          {m.message?.trim() && m.message !== m.mediaUrl && (
                                                <div className={`mt-2.5 p-1.5 text-sm ${isMe ? 'text-black' : 'text-white'} break-words font-sanfrancisco`}>{m.message}</div>
                                          )}
                                    </div>
                              ) : (
                                    <div className="font-sanfrancisco">{m.message || ''}</div>
                              )}

                              <div className="w-full text-end text-[11px] flex items-center justify-end gap-1 mt-1">
                                    {m.state === 'pending' && <Clock className="w-3 h-3 text-yellow-400" />}
                                    {m.state === 'failed' && <AlertTriangle className="w-3 h-3 text-red-500" />}
                                    {m.state === 'sent' && <span className={`text-[9px] ${m.type === "media" && 'pe-1.5'}`}>{timeText}</span>}
                              </div>
                        </div>
                  </div>
            )
      }


      const renderMessagesWithDates = () => {

            const grouped: Record<string, ChatMessage[]> = {}

            for (const msg of chat!.messages) {
                  const dateKey = new Date(msg.createdAt).toDateString()
                  if (!grouped[dateKey]) grouped[dateKey] = []
                  grouped[dateKey].push(msg)
            }

            return Object.keys(grouped).map((dateKey) => {
                  const msgs = grouped[dateKey]
                  const label = formatDateLabel(msgs[0]?.createdAt)

                  return (
                        <div key={dateKey} className="relative">
                              <div className="flex justify-center my-3">
                                    <span className="text-xs bg-[#e21893] text-white font-bold px-4 py-1 rounded-full">
                                          {label}
                                    </span>
                              </div>

                              {msgs.map((m, i) => {
                                    const next = msgs[i + 1]
                                    const prev = msgs[i - 1]
                                    const isLastOfBlock = !next || next.sender.username !== m.sender.username
                                    const isFirstOfBlock = !prev || prev.sender.username !== m.sender.username

                                    return (
                                          <MessageRow
                                                key={i}
                                                m={m}
                                                i={i}
                                                isLastOfBlock={isLastOfBlock}
                                                isFirstOfBlock={isFirstOfBlock}
                                          />
                                    )
                              })}
                        </div>
                  )
            })
      }

      useEffect(() => {

            if (containerRef?.current) {
                  containerRef.current.scrollTop = containerRef.current.scrollHeight
            }

            setTimeout(() => {
                  if (messagesEndRef?.current) {
                        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
                  }
            }, 100);

            setTimeout(() => {
                  if (messagesEndRef?.current) {
                        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
                  }
            }, 300);

            setTimeout(() => {
                  if (messagesEndRef?.current) {
                        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
                  }
            }, 500);

      }, [chat?._id, chat?.messages.length, containerRef, messagesEndRef, showAttachmentMenu]);

      const isMe = contextMenu?.message?.sender?.username === user?.username

      return (
            <>
                  <div
                        ref={containerRef}
                        className={`${showAttachmentMenu ? 'h-[69dvh]' : 'h-[83dvh]'} sm:h-[77dvh] bg-white overflow-y-auto px-3 pt-4 overflow-x-hidden relative`}
                        onClick={() => setContextMenu(null)}
                  >
                        {renderMessagesWithDates()}
                        <div className="pt-3" ref={messagesEndRef} />
                  </div>

                  {/* Context Menu Popup with Glassmorphism */}
                  {contextMenu && (
                        <div
                              className="fixed px-5 inset-0 z-50 flex items-center justify-center backdrop-blur brand-overlay-soft"
                              onClick={() => setContextMenu(null)}
                        >
                              <div className={`flex flex-col  ${isMe ? 'items-end' : 'items-start'} gap-3 animate-in zoom-in-95 duration-200 w-full`}>
                                    {/* Held Message Display */}
                                    <div className="rounded-3xl shadow-2xl min-w-fit max-w-[80%]">
                                          <div className={`rounded-2xl ${contextMenu.message?.sender?.username === user?.username ? 'bg-gray-200 text-black' : 'bg-[#e21893] text-white'} p-4 max-w-xs`}>
                                                {contextMenu.message.type === 'media' ? (
                                                      <div>
                                                            <Image
                                                                  width={150}
                                                                  height={150}
                                                                  src={contextMenu.message.mediaUrl || ''}
                                                                  alt="media"
                                                                  className="rounded-lg max-h-48 object-cover"
                                                            />
                                                            {contextMenu.message.message?.trim() && (
                                                                  <div className="text-sm break-words mt-2 font-sanfrancisco">{contextMenu.message.message}</div>
                                                            )}
                                                      </div>
                                                ) : (
                                                      <div className="text-sm break-words font-sanfrancisco">{contextMenu.message.message || ''}</div>
                                                )}
                                          </div>
                                    </div>

                                    {/* Menu Options */}
                                    <div className="bg-white/80 backdrop-blur-md rounded-[12px] shadow-2xl overflow-hidden w-[70%]">
                                          {/* Keep Option - Only for Admin */}
                                          {user?.role === 'admin' && (
                                                <>
                                                      <button
                                                            onClick={() => handleKeep(contextMenu.messageId)}
                                                            className="w-full bg-white/50! px-6! py-2.5! flex items-center justify-between hover:bg-white transition-colors border-b border-white/30"
                                                      >
                                                            <span className="font-medium text-black text-[16px]">Pin</span>
                                                            <span className="text-xl">📌</span>
                                                      </button>

                                                      <hr className='border-gray-300' />
                                                </>
                                          )}

                                          {/* Reply Option */}
                                          <button
                                                onClick={() => handleReply(contextMenu.messageId)}
                                                className="w-full bg-white/50! px-4! py-2.5! flex items-center justify-between hover:bg-white transition-colors border-b border-white/30"
                                          >
                                                <span className="font-medium text-black text-[16px]">Reply</span>
                                                <CornerDownLeft className="w-5 h-5 text-black" />
                                          </button>

                                          <hr className='border-gray-300' />

                                          {/* Delete or Report based on sender */}
                                          {contextMenu.isMe ? (
                                                <button
                                                      onClick={() => handleDelete(contextMenu.messageId)}
                                                      className="w-full bg-white/50! px-4! py-2.5! flex items-center justify-between hover:bg-white transition-colors text-red-600!"
                                                >
                                                      <span className="text-lg font-medium text-[16px]">Delete</span>
                                                      <Trash2 className="w-5 h-5" />
                                                </button>
                                          ) : (
                                                <button
                                                      onClick={() => handleReport(contextMenu.messageId)}
                                                      className="w-full bg-white/50! px-4! py-2.5! flex items-center justify-between hover:bg-white transition-colors text-red-600!"
                                                >
                                                      <span className="text-lg font-medium text-[16px]">Report</span>
                                                      <AlertTriangle className="w-5 h-5" />
                                                </button>
                                          )}
                                    </div>
                              </div>
                        </div>
                  )}
            </>
      )
}


