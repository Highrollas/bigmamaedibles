'use client'

import { create } from 'zustand'
import { generateRandomString, getQueryString, getClearedMessages, addClearedMessages } from '@/app/Helper'
import { addMutedChat, removeMutedChat, purgeExpiredMutes } from '@/app/Helper'
import APIClient from '@/app/services/apiClient'
import { filterQuery, ChatObj, ReqResp, ChatMessage } from '@/Interface'
import Ably from 'ably'
import useSessionStore from '../auth/user'

interface ChatsStore {
      filterQuery: filterQuery
      chats: ChatObj[]
      showChatInfo: ChatObj | null
      chat: ChatObj | null
      openRoom: boolean
      loading: boolean
      error: string
      init: () => void
      fetchChats: () => Promise<void>
      setChat: (chat: ChatObj | null) => void
      closeRoom: () => void
      setShowChatInfo: (setShowChatInfo: ChatObj | null) => void
      saveChatEdit: (chat: ChatObj) => void
      saveChats: (chats: ChatObj[]) => void
      setFilterQuery: (f: filterQuery) => void
      clearChat: (chatId: string) => void
      muteChat: (chatId: string, duration?: number | 'always') => void
      unmuteChat: (chatId: string) => void
      isChatMuted: (chatId: string) => boolean
      connectAbly: () => void
      sendMessage: (chatId: string, text: string, type: 'text' | 'media', mediaUrl?: string, replyTo?: { messageId: string; message: string; sender: string }) => Promise<void>
      sendMediaMessage: (
            chatId: string,
            text: string,
            file: File,
            localPreviewUrl: string,
            replyTo?: { messageId: string; message: string; sender: string }
      ) => Promise<void>
      fullscreenImage: { messageObj: ChatMessage; chatId: string } | null
      setFullscreenImage: (message: { messageObj: ChatMessage; chatId: string } | null) => void
}

let isInitiated = false
let ablyClient: Ably.Realtime | null = null

const useChatsStore = create<ChatsStore>((set, get) => ({
      filterQuery: { page: 1, itemsPerPage: 25 },
      loading: true,
      error: '',
      chats: [],
      chat: null,
      openRoom: false,
      fullscreenImage: null,

      setFullscreenImage: (message) => set({ fullscreenImage: message }),

      showChatInfo: null,

      init: async () => {
            if (!isInitiated) {
                  isInitiated = true
                  purgeExpiredMutes()
                  await get().fetchChats()
                  get().connectAbly()

                  // Optional: auto cleanup every 5 min
                  setInterval(purgeExpiredMutes, 5 * 60 * 1000)
            }
      },



      setChat: (chat) => set({ chat, openRoom: true }),
      closeRoom: () => set({ openRoom: false }),

      fetchChats: async () => {
            const qs = getQueryString(get().filterQuery)
            set({ loading: true })
            const resp = await new APIClient<ReqResp & { chats: ChatObj[] }>(`/chats${qs}`).get()

            if (resp && resp.status === 'success') {
                  const mutedChats = purgeExpiredMutes()
                  const chats = resp.chats.map(chat => {
                        const cleared = getClearedMessages(chat._id)
                        const muted = mutedChats.some(m => m.id === chat._id)
                        return { ...chat, messages: chat.messages.filter(m => !cleared.includes(m.id)), muted }
                  })
                  set({ chats, chat: chats[0] || null, loading: false })
            } else {
                  set({ chats: [], loading: false, error: resp.message })
            }
      },

      saveChatEdit: (chat) =>
            set((store) => ({
                  chats: store.chats.map((p) =>
                        p._id === chat._id ? { ...chat } : p
                  ),
            })),

      saveChats: (chats) => set({ chats, loading: false }),

      setShowChatInfo: (showChatInfo) => {
            set({ showChatInfo })
      },

      setFilterQuery: (f) => set({ filterQuery: f }),

      clearChat: (chatId: string) => {
            set((state) => {
                  const chat = state.chats.find(c => c._id === chatId)
                  if (!chat) return {}

                  const messageIds = chat.messages.map(m => m.id)
                  addClearedMessages(chatId, messageIds)

                  const updatedChats = state.chats.map(c =>
                        c._id === chatId ? { ...c, messages: [] } : c
                  )
                  const updatedChat =
                        state.chat && state.chat._id === chatId
                              ? { ...state.chat, messages: [] }
                              : state.chat

                  return { chats: updatedChats, chat: updatedChat }
            })
      },

      /* ---------- Mute / Unmute with Duration ---------- */
      muteChat: (chatId: string, duration?: number | 'always') => {
            addMutedChat(chatId, duration)
            set(state => ({
                  chats: state.chats.map(c =>
                        c._id === chatId ? { ...c, muted: true } : c
                  ),
                  chat: state.chat && state.chat._id === chatId ? { ...state.chat, muted: true } : state.chat,
            }))
      },

      unmuteChat: (chatId: string) => {
            removeMutedChat(chatId)
            set(state => ({
                  chats: state.chats.map(c =>
                        c._id === chatId ? { ...c, muted: false } : c
                  ),
                  chat: state.chat && state.chat._id === chatId ? { ...state.chat, muted: false } : state.chat,
            }))
      },

      isChatMuted: (chatId: string) => {
            const mutedChats = purgeExpiredMutes()
            return mutedChats.some(m => m.id === chatId)
      },

      /* ---------- Ably ---------- */
      connectAbly: () => {
            if (ablyClient) return

            ablyClient = new Ably.Realtime({
                  authUrl: '/api/ably-auth',
                  echoMessages: false,
            })

            setTimeout(() => {
                  const { chats } = get()
                  chats.forEach((chat) => {
                        const channel = ablyClient!.channels.get(`chat:${chat._id}`)
                        channel.subscribe('message', (msg) => {
                              const message = msg.data as ChatMessage

                              set((state) => {
                                    const exists = state.chats.some(
                                          c => c._id === chat._id &&
                                                c.messages.some(m => m.id && m.id === message.id)
                                    )
                                    if (exists) return {}

                                    const cleared = getClearedMessages(chat._id)
                                    if (cleared.includes(message.id)) return {}

                                    return {
                                          chats: state.chats.map((c) =>
                                                c._id === chat._id
                                                      ? { ...c, messages: [...c.messages, message] }
                                                      : c
                                          ),
                                          chat:
                                                state.chat && state.chat._id === chat._id
                                                      ? { ...state.chat, messages: [...state.chat.messages, message] }
                                                      : state.chat,
                                    }
                              })
                        })
                  })
            }, 0)
      },

      /* ---------- Send Message ---------- */
      sendMessage: async (chatId, text, type = 'text', mediaUrl, replyTo) => {
            const trimmed = text.trim()
            if (!trimmed && type === 'text') return

            const now = new Date().toISOString()
            const id = generateRandomString(48)

            const pending: ChatMessage = {
                  id,
                  state: 'pending',
                  message: trimmed,
                  type,
                  mediaUrl: mediaUrl ?? '',
                  createdAt: now,
                  updatedAt: now,
                  status: 'active',
                  sender: {
                        username: useSessionStore.getState().user!.username,
                        role: 'user',
                        avatar: useSessionStore.getState().user!.avatar,
                  },
                  ...(replyTo ? { replyTo } : {}),
            }

            // optimistic insert
            set((state) => ({
                  chats: state.chats.map((c) =>
                        c._id === chatId
                              ? { ...c, messages: [...c.messages, pending] }
                              : c
                  ),
                  chat:
                        state.chat && state.chat._id === chatId
                              ? { ...state.chat, messages: [...state.chat.messages, pending] }
                              : state.chat,
            }))

            // 📨 Send to backend
            const resp = await new APIClient<ReqResp & { messageObj: ChatMessage }>('/chats').post({
                  chatId,
                  message: trimmed,
                  id,
                  type,
                  mediaUrl,
                  replyTo,
            })

            if (resp.status === 'success') {
                  const confirmed = { ...resp.messageObj }

                  set((state) => ({
                        chats: state.chats.map((c) =>
                              c._id === chatId
                                    ? {
                                          ...c,
                                          messages: c.messages.map((m) =>
                                                m.id === id ? confirmed : m
                                          ),
                                    }
                                    : c
                        ),
                        chat:
                              state.chat && state.chat._id === chatId
                                    ? {
                                          ...state.chat,
                                          messages: state.chat.messages.map((m) =>
                                                m.id === id ? confirmed : m
                                          ),
                                    }
                                    : state.chat,
                  }))
            } else {
                  set((state) => {
                        const updateMessages = (messages: ChatMessage[]) =>
                              messages.map((m) => (m.id === id ? { ...m, state: 'failed' } : m))

                        return {
                              chats: state.chats.map((c) =>
                                    c._id === chatId ? { ...c, messages: updateMessages(c.messages) } : c
                              ),
                              chat:
                                    state.chat && state.chat._id === chatId
                                          ? { ...state.chat, messages: updateMessages(state.chat.messages) }
                                          : state.chat,
                        }
                  })
            }
      },

      sendMediaMessage: async (chatId, text, file, localPreviewUrl, replyTo) => {
            const trimmed = text.trim()
            const now = new Date().toISOString()
            const id = generateRandomString(48)

            const pending: ChatMessage = {
                  id,
                  state: 'pending',
                  message: trimmed,
                  type: 'media',
                  mediaUrl: localPreviewUrl,
                  createdAt: now,
                  updatedAt: now,
                  status: 'active',
                  sender: {
                        username: useSessionStore.getState().user!.username,
                        role: 'user',
                        avatar: useSessionStore.getState().user!.avatar,
                  },
                  ...(replyTo ? { replyTo } : {}),
            }

            set((state) => ({
                  chats: state.chats.map((c) =>
                        c._id === chatId
                              ? { ...c, messages: [...c.messages, pending] }
                              : c
                  ),
                  chat:
                        state.chat && state.chat._id === chatId
                              ? { ...state.chat, messages: [...state.chat.messages, pending] }
                              : state.chat,
            }))

            try {
                  const formData = new FormData()
                  formData.append('file', file)

                  const uploadResp = await fetch('https://cdn.bigmamasedibles.cc/', {
                        method: 'POST',
                        body: formData,
                  })

                  if (!uploadResp.ok) {
                        throw new Error('Media upload failed')
                  }

                  const uploadData = await uploadResp.json()
                  const uploadedMediaUrl = uploadData?.url

                  if (!uploadedMediaUrl) {
                        throw new Error('Uploaded media URL missing')
                  }

                  const resp = await new APIClient<ReqResp & { messageObj: ChatMessage }>('/chats').post({
                        chatId,
                        message: trimmed,
                        id,
                        type: 'media',
                        mediaUrl: uploadedMediaUrl,
                        replyTo,
                  })

                  if (resp.status === 'success') {
                        const confirmed = { ...resp.messageObj }

                        set((state) => ({
                              chats: state.chats.map((c) =>
                                    c._id === chatId
                                          ? {
                                                ...c,
                                                messages: c.messages.map((m) =>
                                                      m.id === id ? confirmed : m
                                                ),
                                          }
                                          : c
                              ),
                              chat:
                                    state.chat && state.chat._id === chatId
                                          ? {
                                                ...state.chat,
                                                messages: state.chat.messages.map((m) =>
                                                      m.id === id ? confirmed : m
                                                ),
                                          }
                                          : state.chat,
                        }))

                        URL.revokeObjectURL(localPreviewUrl)
                  } else {
                        throw new Error(resp.message || 'Failed to send media message')
                  }
            } catch (error) {
                  console.error('sendMediaMessage error:', error)

                  set((state) => {
                        const updateMessages = (messages: ChatMessage[]) =>
                              messages.map((m) => (m.id === id ? { ...m, state: 'failed' } : m))

                        return {
                              chats: state.chats.map((c) =>
                                    c._id === chatId ? { ...c, messages: updateMessages(c.messages) } : c
                              ),
                              chat:
                                    state.chat && state.chat._id === chatId
                                          ? { ...state.chat, messages: updateMessages(state.chat.messages) }
                                          : state.chat,
                        }
                  })
            }
      },
}))

export default useChatsStore

