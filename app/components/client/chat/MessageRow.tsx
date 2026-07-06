/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image'
import { Shield, Clock, AlertTriangle } from 'lucide-react'

export default function MessageRow({ m, user, isLastOfBlock, isFirstOfBlock, allowPFP, onImageClick }: any) {
      const isMe = m.sender.username === user?.username

      return (
            <div
                  className={`relative chat ${isMe ? 'chat-end' : 'chat-start'} ${isLastOfBlock ? '' : 'mb-[-6.8px]'}`}
            >
                  {allowPFP && (
                        <div className="chat-image avatar flex-shrink-0">
                              {isLastOfBlock ? (
                                    <div className="w-8 rounded-full brand-panel overflow-hidden">
                                          <Image
                                                width={100}
                                                height={100}
                                                alt={m.sender.username}
                                                src={`/assets/images/${m.sender.avatar}.png`}
                                          />
                                    </div>
                              ) : (
                                    <div className="w-8" />
                              )}
                        </div>
                  )}

                  <div
                        className={`${isLastOfBlock ? 'chat-bubble' : 'px-[1rem] py-[0.5rem]'} max-w-[80%] rounded-2xl ${isMe ? 'bg-gray-200 text-black' : 'brand-panel text-white'}`}
                  >
                        {isFirstOfBlock && !isMe && (
                              <div className="flex items-center gap-1 mb-0.5 pe-4 text-[80%] font-bold!">
                                    @{m.sender.username}
                                    {m.sender.role === 'admin' && <Shield className="w-3 h-3 text-yellow-400" />}
                              </div>
                        )}

                        {m.type === 'media' ? (
                              <div>
                                    <Image
                                          width={200}
                                          height={200}
                                          src={m.mediaUrl || ''}
                                          alt="media"
                                          onClick={() => onImageClick(m.mediaUrl)}
                                          className="rounded-lg mt-1 cursor-pointer hover:opacity-90 transition"
                                    />
                                    {m.message?.trim() && (
                                          <div className={`mt-1.5 text-sm ${isMe ? 'text-black' : 'text-white'} break-words`}>{m.message}</div>
                                    )}
                              </div>
                        ) : (
                              <div>{m.message || ''}</div>
                        )}

                        <div className="w-full text-end text-[11px] flex items-center justify-end gap-1">
                              {m.state === 'pending' && <Clock className="w-3 h-3 text-yellow-400" />}
                              {m.state === 'failed' && <AlertTriangle className="w-3 h-3 text-red-500" />}
                        </div>
                  </div>
            </div>
      )
}

