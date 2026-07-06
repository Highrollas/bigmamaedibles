/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { Ref, useEffect } from 'react'
import { Plus, SendHorizonal, X } from 'lucide-react'
import { ChatMessage, UserObj } from '@/Interface';
import { truncate } from '@/app/Helper';

interface ChatInputProps {
      textInputRef: Ref<HTMLTextAreaElement>;
      handleSend: () => void
      keyboardOpen: boolean
      setKeyboardOpen: (v: boolean) => void
      showAttachmentMenu: boolean
      setShowAttachmentMenu: (v: boolean) => void
      chat: any
      user: UserObj | null
      replyingTo: ChatMessage | null
      setReplyingTo: (msg: ChatMessage | null) => void
}

export default function ChatInput({
      textInputRef,
      handleSend,
      keyboardOpen,
      setKeyboardOpen,
      showAttachmentMenu,
      setShowAttachmentMenu,
      chat,
      user,
      replyingTo,
      setReplyingTo,
}: ChatInputProps) {

      useEffect(() => {
            if (replyingTo && textInputRef && 'current' in textInputRef && textInputRef.current) {
                  textInputRef.current.focus()
            }
      }, [replyingTo, textInputRef])

      return (
            <div className='fixed bottom-0 left-0 right-0'>
                  <div className={`relative brand-panel px-2 py-3 ${keyboardOpen ? '' : 'pb-6'} sm:px-5`}>
                        {/* Reply Preview Bar */}
                        {replyingTo && (
                              <div className="mb-2 bg-gray-800 rounded-lg px-3 py-2 flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                          <div className="text-xs text-white font-semibold! mb-1">
                                                Replying to @{replyingTo.sender.username}
                                          </div>
                                          <div className="text-sm text-gray-300 truncate">
                                                {replyingTo.type === 'media'
                                                      ? (replyingTo.message?.trim() ? `📷 ${truncate(replyingTo.message, 50)}` : '📷 Photo')
                                                      : truncate(replyingTo.message || '', 50)}
                                          </div>
                                    </div>
                                    <button
                                          onClick={() => setReplyingTo(null)}
                                          className="ml-2 p-1 hover:bg-gray-700 rounded-full transition-colors"
                                    >
                                          <X className="w-4 h-4 text-gray-400" />
                                    </button>
                              </div>
                        )}
                        <div
                              className={`${keyboardOpen || showAttachmentMenu ? '' : ''}
                                          h-fit items-end
                                          sm:pb-0 flex justify-between
                                          ${showAttachmentMenu && 'mb-[12vh]'}`
                              }
                        >
                              {chat.onlyAdmins && user?.role != 'admin' ? (
                                    <div className="flex items-center justify-center text-white w-full font-bold! pt-3">
                                          <div className=''>
                                                This Is A View Only Chat
                                          </div>
                                    </div>
                              ) : (
                                    <>
                                          <div className="flex w-[15%] justify-center sm:w-[10%] relative z-10 pb-1">
                                                <Plus
                                                      className="text-white cursor-pointer"
                                                      onClick={(e) => {
                                                            e.stopPropagation()
                                                            setShowAttachmentMenu(!showAttachmentMenu)
                                                      }}
                                                />
                                          </div>

                                          {/* Textarea */}
                                          <div className="w-[70%] sm:w-[80%] flex items-end">
                                                <textarea
                                                      ref={textInputRef}
                                                      cols={1}
                                                      rows={1}
                                                      // placeholder="Type a message..."
                                                      className="
                                                            resize-none w-full
                                                            rounded-2xl 
                                                            border-none bg-white 
                                                            px-4 py-1
                                                            text-black 
                                                            outline-none
                                                            overflow-y-auto
                                                      "
                                                      onFocus={() => setKeyboardOpen(true)}
                                                      onBlur={() => setKeyboardOpen(false)}
                                                      onInput={(e: any) => {
                                                            const el = e.target as HTMLTextAreaElement;
                                                            el.style.height = "32px";
                                                            el.style.height = Math.max(32, el.scrollHeight) + "px";
                                                            el.style.maxHeight = "100px";
                                                      }}
                                                      onKeyDown={(e) => {
                                                            if (e.key === "Enter" && !e.shiftKey) {
                                                                  e.preventDefault();
                                                                  handleSend();
                                                            }
                                                      }}
                                                ></textarea>
                                          </div>

                                          <div className="flex w-[15%] justify-center sm:w-[10%] relative z-10 pb-1">
                                                <SendHorizonal
                                                      className="text-white cursor-pointer"
                                                      onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            setReplyingTo(null)
                                                            handleSend();
                                                      }}
                                                />
                                          </div>
                                    </>
                              )}
                        </div>
                  </div>
            </div>
      )
}
