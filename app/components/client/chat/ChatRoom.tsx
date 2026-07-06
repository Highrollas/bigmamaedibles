/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import useChatsStore from '@/app/hooks/store/Chat'
import useSessionStore from '@/app/hooks/auth/user'
import ChatHeader from './ChatHeader'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import AttachmentMenu from './AttachmentMenu'
import FullScreenImageViewer from './FullScreenImageViewer'
import { ChatMessage } from '@/Interface'
import { SendHorizonal, X } from 'lucide-react'
import Image from 'next/image'


export default function ChatRoom() {

      const { chat: _chat, chats, closeRoom, sendMessage, sendMediaMessage, setFullscreenImage, fullscreenImage } = useChatsStore()
      const { user } = useSessionStore()
      const chat = _chat ?? chats[4]

      const textInputRef = useRef<HTMLTextAreaElement | null>(null)
      const [keyboardOpen, setKeyboardOpen] = useState(false)
      const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)
      const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null)
      const [pendingMedia, setPendingMedia] = useState<{ file: File; previewUrl: string } | null>(null)
      const [sendingMedia, setSendingMedia] = useState(false)

      const messagesEndRef = useRef<HTMLDivElement | null>(null)
      const containerRef = useRef<HTMLDivElement | null>(null)
      const photoInputRef = useRef<HTMLInputElement | null>(null)
      const cameraInputRef = useRef<HTMLInputElement | null>(null)
      const attachmentMenuRef = useRef<HTMLDivElement | null>(null)

      useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                  if (
                        attachmentMenuRef.current &&
                        !attachmentMenuRef.current.contains(e.target as Node)
                  ) {
                        setShowAttachmentMenu(false)
                  }
            }
            if (showAttachmentMenu) document.addEventListener('click', handleClickOutside)
            return () => document.removeEventListener('click', handleClickOutside)
      }, [showAttachmentMenu])


      const EDGE_SWIPE_ZONE = 30; // px from screen edge
      const swipeHandlers = useSwipeable({
            trackMouse: true,

            // Only close room if swipe started at the left edge
            onSwipedRight: (e) => {
                  const startX = e.initial[0]; // finger/mouse start position (X)
                  if (startX <= EDGE_SWIPE_ZONE) {
                        closeRoom();
                  }
            },

            // Prevent conflict with message swipes
            preventScrollOnSwipe: true,
            delta: 10, // minimal movement needed
      });

      useEffect(() => {
            const handleKeyDown = (e: KeyboardEvent) => {
                  if (e.key === 'Escape') setFullscreenImage(null)
            }
            window.addEventListener('keydown', handleKeyDown)
            return () => window.removeEventListener('keydown', handleKeyDown)
      }, [setFullscreenImage])

      const handleSend = async () => {
            const trimmed = textInputRef.current?.value.trim()
            if (!trimmed) return
            textInputRef.current!.value = "";
            textInputRef.current!.style.height = "32px";
            textInputRef.current!.style.maxHeight = "100px";

            // Include reply data if replying
            const replyData = replyingTo ? {
                  messageId: replyingTo.id,
                  message: replyingTo.message || (replyingTo.type === 'media' ? '📷 Photo' : ''),
                  sender: replyingTo.sender.username
            } : undefined;

            await sendMessage(chat._id, trimmed, 'text', undefined, replyData)
            setReplyingTo(null); // Clear reply state after sending
      }

      const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            if (!file) return
            try {
                  const previewUrl = URL.createObjectURL(file)
                  setPendingMedia({ file, previewUrl })
                  textInputRef.current!.value = "";
                  textInputRef.current!.style.height = "32px";
                  textInputRef.current!.style.maxHeight = "100px";
                  setShowAttachmentMenu(false)
            } catch (err) {
                  console.error('Upload failed', err)
            } finally {
                  e.target.value = ''
            }
      }

      const closePendingMedia = (revokePreview = true) => {
            if (revokePreview && pendingMedia?.previewUrl) {
                  URL.revokeObjectURL(pendingMedia.previewUrl)
            }
            setPendingMedia(null)
            textInputRef.current!.value = "";
            textInputRef.current!.style.height = "32px";
            textInputRef.current!.style.maxHeight = "100px";
      }

      const handleSendMedia = async () => {
            if (!pendingMedia || sendingMedia) return

            try {
                  setSendingMedia(true)
                  const trimmed = textInputRef.current?.value.trim() || "";
                  const replyData = replyingTo ? {
                        messageId: replyingTo.id,
                        message: replyingTo.message || (replyingTo.type === 'media' ? '📷 Photo' : ''),
                        sender: replyingTo.sender.username
                  } : undefined;

                  const mediaToSend = pendingMedia

                  textInputRef.current!.value = "";
                  textInputRef.current!.style.height = "32px";
                  textInputRef.current!.style.maxHeight = "100px";
                  setReplyingTo(null)
                  closePendingMedia(false)

                  await sendMediaMessage(chat._id, trimmed, mediaToSend.file, mediaToSend.previewUrl, replyData)
            } catch (err) {
                  console.error('Upload failed', err)
            } finally {
                  setSendingMedia(false)
            }
      }

      if (!chat) return null

      return (

            <div {...swipeHandlers} className="flex flex-col h-100dvh overflow-y-hidden brand-panel">

                  <ChatHeader chat={chat} closeRoom={closeRoom} />

                  <div className="flex-1 overflow-y-auto">

                        <ChatMessages
                              chat={chat}
                              user={user}
                              setFullscreenImage={setFullscreenImage}
                              messagesEndRef={messagesEndRef}
                              showAttachmentMenu={showAttachmentMenu}
                              keyboardOpen={keyboardOpen}
                              containerRef={containerRef}
                              setReplyingTo={setReplyingTo}
                        />
                  </div>

                  <ChatInput
                        textInputRef={textInputRef}
                        handleSend={handleSend}
                        keyboardOpen={keyboardOpen}
                        setKeyboardOpen={setKeyboardOpen}
                        showAttachmentMenu={showAttachmentMenu}
                        setShowAttachmentMenu={setShowAttachmentMenu}
                        chat={chat}
                        replyingTo={replyingTo}
                        setReplyingTo={setReplyingTo}
                        user={user}
                  />

                  <input
                        type="file"
                        ref={photoInputRef}
                        accept="image/*,video/*"
                        hidden
                        onChange={handleFileUpload}
                  />

                  <input
                        type="file"
                        ref={cameraInputRef}
                        accept="image/*"
                        capture="environment"
                        hidden
                        onChange={handleFileUpload}
                  />

                  {showAttachmentMenu && (
                        <AttachmentMenu
                              photoInputRef={photoInputRef}
                              cameraInputRef={cameraInputRef}
                              attachmentMenuRef={attachmentMenuRef}
                        />
                  )}

                  {fullscreenImage && (
                        <FullScreenImageViewer />
                  )}

                  {pendingMedia && (
                        <div className="fixed inset-0 z-[200] bg-white flex flex-col">
                              <div className="flex items-center brand-panel justify-between p-4 text-white/95">
                                    <div
                                          className="p-1 h-12 w-12 flex justify-center items-center rounded-full brand-panel"
                                          onClick={() => closePendingMedia()}
                                    >
                                          <X className="w-8 h-8" />
                                    </div>
                              </div>

                              <div className="flex-1 px-2 pb-28 flex items-center justify-center overflow-hidden">
                                    <Image
                                          src={pendingMedia.previewUrl}
                                          alt="Selected media preview"
                                          width={1000}
                                          height={1000}
                                          unoptimized
                                          className="max-h-full max-w-full object-contain"
                                    />
                              </div>

                              <div className="absolute bottom-0 left-0 right-0 brand-panel pt-5 pb-8 px-5 flex items-center">

                                    <div className="w-[85%] sm:w-[80%] flex items-end">
                                          <textarea
                                                ref={textInputRef}
                                                cols={1}
                                                rows={1}
                                                placeholder='Add Caption...'
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
                                                onInput={(e: any) => {
                                                      const el = e.target as HTMLTextAreaElement;
                                                      el.style.height = "32px";
                                                      el.style.height = Math.max(32, el.scrollHeight) + "px";
                                                      el.style.maxHeight = "100px";
                                                }}
                                                onKeyDown={(e) => {
                                                      if (e.key === "Enter" && !e.shiftKey) {
                                                            e.preventDefault();
                                                            handleSendMedia();
                                                      }
                                                }}
                                          ></textarea>
                                    </div>

                                    <div className="flex w-[15%] justify-end sm:w-[10%] relative z-10 pb-1"
                                          onClick={handleSendMedia}
                                    // disabled={sendingMedia}
                                    >
                                          <SendHorizonal className="w-5 h-5 text-white" />
                                    </div>
                              </div>

                        </div>

                  )
                  }

            </div >
      )
}

