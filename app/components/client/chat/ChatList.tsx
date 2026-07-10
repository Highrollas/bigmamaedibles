/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { ChatObj } from '@/Interface'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Info, X, XCircle, BellOff, Search, ImageIcon, ChevronLeft, BookOpen, Pin } from 'lucide-react'
import useChatsStore from '@/app/hooks/store/Chat'
import ChatRow from './ChatRow'
import FullScreenImageViewer from './FullScreenImageViewer'
import Link from 'next/link'

interface Props {
      chats: ChatObj[]
}

export default function ChatList({ chats }: Props) {

      const [activeChat, setActiveChat] = useState<ChatObj | null>(null)
      const [clearChatObj, setClearChatObj] = useState<ChatObj | null>(null)
      const [muteChatObj, setMuteChatObj] = useState<ChatObj | null>(null)
      const [showChatMediaObj, setShowChatMediaObj] = useState<ChatObj | null>(null)
      const [showDescOv, setShowDescOv] = useState(false);

      //stores chat being swipe to close other swipe
      const [openSwipe, setOpenSwipe] = useState<ChatObj | null>(null);

      // State for rules modal
      const [showRulesModal, setShowRulesModal] = useState(false);

      // State for user count
      const [userCount, setUserCount] = useState<number>(0);

      const { clearChat, muteChat, unmuteChat, isChatMuted, showChatInfo, setShowChatInfo, fullscreenImage, setFullscreenImage } = useChatsStore();

      useEffect(() => {
            const fetchUserCount = async () => {
                  try {
                        const response = await fetch('/api/stats/user-count');
                        const data = await response.json();
                        if (data.status === 'success') {
                              setUserCount(data.count);
                        }
                  } catch (error) {
                        console.error('Failed to fetch user count:', error);
                  }
            };

            fetchUserCount();
      }, []);

      const closeDrawer = (closeOv: any = true) => {
            setActiveChat(null);
            if (closeOv) closeOverlay()
            // setShowDescOv(false);
            setClearChatObj(null)
            setMuteChatObj(null)
      }

      const closeClearChatDialog = () => {
            setClearChatObj(null)
            closeOverlay()
      }

      const closeMuteChatDialog = () => {
            setMuteChatObj(null)
            closeOverlay()
      }

      const closeOverlay = () => {
            const el = document.getElementById('chat-bottom-drawer') as HTMLInputElement
            if (el) el.checked = false
            const overlay = document.querySelector('label[for="chat-bottom-drawer"]')
            overlay?.classList.remove('opacity-100', 'pointer-events-auto')
            setShowDescOv(false);
      }

      const handleClearChat = async (chat: ChatObj) => {
            closeDrawer(false)
            setClearChatObj(chat)
      }

      const handleMuteChat = async (chat: ChatObj) => {
            closeDrawer(false)
            setMuteChatObj(chat)
      }

      const handleShowGroupInfo = (chat: ChatObj) => {
            setShowChatInfo(chat);
            closeDrawer()
      }

      const triggerMute = (chatId: string, duration: number | 'always') => {
            muteChat(chatId, duration)
            closeMuteChatDialog()
      }

      return (
            <>
                  {/* Hidden checkbox controls the drawer */}
                  <input id="chat-bottom-drawer" type="checkbox" className="drawer-toggle hidden" />

                  {/* Overlay */}
                  <label
                        htmlFor="chat-bottom-drawer"
                        onClick={closeDrawer}
                        className={`fixed inset-0 brand-tint backdrop-blur-sm opacity-0 transition-opacity duration-300 ${showDescOv ? 'z-150' : 'z-40'} w-full sm:w-[40%] lg:w-[30%] 
                        ${(!activeChat && !muteChatObj && !clearChatObj && !showDescOv) && 'pointer-events-none'}`}>

                  </label>

                  {/* Drawer for options */}
                  <div
                        className="fixed bottom-0 left-0 w-full sm:w-[40%] lg:w-[30%] z-50
                        translate-y-full transition-transform duration-300
                        bg-white/60 p-5 pb-10 rounded-t-2xl
                        data-[open=true]:translate-y-0"
                        data-open={!!activeChat}
                  >
                        {activeChat && (
                              <>
                                    <div className="flex items-center justify-between pb-4">
                                          <div className="flex items-center gap-3">
                                                <Image
                                                      src={activeChat.imageUrl}
                                                      alt={activeChat.name}
                                                      width={35}
                                                      height={35}
                                                      className="rounded-full"
                                                />
                                                <h3 className="font-semibold text-lg">{activeChat.name}</h3>
                                          </div>
                                          <div
                                                onClick={closeDrawer}
                                                className="bg-gray-200 h-8 w-8 rounded-full flex justify-center items-center cursor-pointer"
                                          >
                                                <X className="w-5 h-5" />
                                          </div>
                                    </div>

                                    <div className="bg-white rounded-[9px]">
                                          <ul className="p-4 space-y-3">

                                                <li
                                                      className="flex justify-between items-center cursor-pointer"
                                                      onClick={() => {
                                                            handleShowGroupInfo(activeChat)
                                                      }}
                                                >
                                                      <span className="text-left">Group Info</span>
                                                      <Info className="w-5 h-5" />
                                                </li>

                                                <li
                                                      className="flex justify-between items-center cursor-pointer"
                                                      onClick={() => handleMuteChat(activeChat)}
                                                >
                                                      <span className="text-left">
                                                            {isChatMuted(activeChat._id) ? 'Unmute' : 'Mute'}
                                                      </span>
                                                      <BellOff className="w-5 h-5" />
                                                </li>

                                                <li
                                                      className="flex justify-between items-center cursor-pointer text-red-500"
                                                      onClick={() => handleClearChat(activeChat)}
                                                >
                                                      <span className="text-left">Clear Chat</span>
                                                      <XCircle className="w-5 h-5 text-red-500" />
                                                </li>
                                          </ul>
                                    </div>
                              </>
                        )}
                  </div>

                  {/* Clear chat dialog */}
                  <div
                        className="fixed bottom-0 left-0 w-full sm:w-[40%] lg:w-[30%] z-150
                        translate-y-full transition-transform duration-300
                        bg-white/60 p-5 rounded-t-2xl
                        data-[open=true]:translate-y-0"
                        data-open={!!clearChatObj}
                  >
                        {clearChatObj && (
                              <>
                                    <div className="flex items-center justify-between pb-4">
                                          <h3 className="font-semibold text-[13px]">
                                                Clear All Messages from “{clearChatObj.name}” ?
                                          </h3>
                                          <div
                                                onClick={closeClearChatDialog}
                                                className="bg-gray-200 h-8 w-8 rounded-full flex justify-center items-center cursor-pointer"
                                          >
                                                <X className="w-5 h-5" />
                                          </div>
                                    </div>

                                    <div className="bg-white rounded-[9px] text-center p-5 mb-3 text-xs">
                                          This Chat Will Be Empty But Remain In Your Chat List
                                    </div>

                                    <div className="bg-white rounded-[9px]">
                                          <ul className="p-4 space-y-3">
                                                <li
                                                      className="flex justify-between items-center cursor-pointer text-red-500"
                                                      onClick={() => {
                                                            clearChat(clearChatObj._id)
                                                            closeClearChatDialog()
                                                      }}
                                                >
                                                      <span className="text-left">Clear All Messages</span>
                                                      <XCircle className="w-5 h-5 text-red-500" />
                                                </li>
                                          </ul>
                                    </div>
                              </>
                        )}
                  </div>

                  {/* Mute chat dialog */}
                  <div
                        className="fixed bottom-0 left-0 w-full sm:w-[40%] lg:w-[30%] z-150
                        translate-y-full transition-transform duration-300
                        bg-white/60 p-5 rounded-t-2xl
                        data-[open=true]:translate-y-0"
                        data-open={!!muteChatObj}
                  >
                        {muteChatObj && (
                              <>
                                    <div className="flex items-center justify-between pb-4">
                                          <h3 className="font-semibold text-[13px]">
                                                {isChatMuted(muteChatObj._id)
                                                      ? `Unmute ${muteChatObj.name}?`
                                                      : `Mute notifications from “${muteChatObj.name}”?`}
                                          </h3>
                                          <div
                                                onClick={closeMuteChatDialog}
                                                className="bg-gray-200 h-8 w-8 rounded-full flex justify-center items-center cursor-pointer"
                                          >
                                                <X className="w-5 h-5" />
                                          </div>
                                    </div>


                                    {!isChatMuted(muteChatObj._id) ? (

                                          <>
                                                <div className="bg-white rounded-[9px] text-center p-5 mb-3 text-xs">
                                                      You Will Not Receive Notifications From {muteChatObj.name} During The Muted Period
                                                </div>
                                                <div className="bg-white rounded-[9px]">
                                                      <ul className="p-4 space-y-3">
                                                            <li
                                                                  className="cursor-pointer text-left border-b border-gray-300 pb-3"
                                                                  onClick={() => triggerMute(muteChatObj._id, 8 * 60 * 60 * 1000)}
                                                            >
                                                                  8 hours
                                                            </li>
                                                            <li
                                                                  className="cursor-pointer text-left border-b border-gray-300 pb-3"
                                                                  onClick={() => triggerMute(muteChatObj._id, 7 * 24 * 60 * 60 * 1000)}
                                                            >
                                                                  1 week
                                                            </li>
                                                            <li
                                                                  className="cursor-pointer text-left"
                                                                  onClick={() => triggerMute(muteChatObj._id, 'always')}
                                                            >
                                                                  Always
                                                            </li>
                                                      </ul>
                                                </div>

                                          </>


                                    ) : (
                                          <div className="bg-white rounded-[9px]">
                                                <ul className="p-4 space-y-3">
                                                      <li
                                                            className="flex justify-between items-center cursor-pointer text-red-500"
                                                            onClick={() => {
                                                                  unmuteChat(muteChatObj._id)
                                                                  closeMuteChatDialog()
                                                            }}
                                                      >
                                                            <span className="text-left">Unmute Notifications</span>
                                                            <BellOff className="w-5 h-5 text-red-500" />
                                                      </li>
                                                </ul>
                                          </div>
                                    )}
                              </>
                        )}
                  </div>

                  {/* Group Info Overlay */}
                  <div
                        className={`fixed inset-0 z-50 bg-gray-100 transition-transform duration-300 overflow-y-auto
                        ${showChatInfo ? 'translate-y-0' : 'translate-y-full'}`}
                  >
                        {showChatInfo && (

                              <div className="flex flex-col min-h-screen">

                                    {/* Header */}
                                    <div className="flex items-center justify-between p-4 sticky top-0 z-10">
                                          <div className="flex items-center gap-3">
                                                <div
                                                      className="cursor-pointer"
                                                      onClick={() => setShowChatInfo(null)}
                                                >
                                                      <ChevronLeft />
                                                </div>
                                          </div>
                                    </div>

                                    {/* Group Image + Name */}
                                    <div className="flex flex-col items-center justify-center mt-6 mb-4">
                                          <div className="relative">
                                                <Image
                                                      src={showChatInfo.imageUrl}
                                                      alt={showChatInfo.name}
                                                      width={100}
                                                      height={100}
                                                      className="rounded-full object-cover border"
                                                />
                                          </div>
                                          <h3 className="text-lg font-semibold mt-3">{showChatInfo.name}</h3>
                                    </div>

                                    {/* Buttons / Options */}
                                    <div className='px-3 mt-5'>
                                          <div className="flex justify-between">
                                                <div
                                                      onClick={() => setShowChatMediaObj(showChatInfo)}
                                                      className="flex flex-col items-center justify-center h-auto py-2.5 w-[23%] bg-white text-black rounded-[9px] cursor-pointer">
                                                      <ImageIcon size={22} className='text-black' />
                                                      <div className='mt-2 text-[85%] text-black'>Media</div>
                                                </div>
                                                <div className="flex flex-col items-center justify-center h-auto py-2.5 w-[23%] bg-white text-black rounded-[9px] cursor-pointer">
                                                      <Pin size={22} className='text-black' />
                                                      <div className='mt-2 text-[85%] text-black'>Pinned</div>
                                                </div>
                                                <div
                                                      className="flex flex-col items-center justify-center h-auto py-2.5 w-[23%] bg-white text-black rounded-[9px] cursor-pointer"
                                                      onClick={() => setShowRulesModal(true)}
                                                >
                                                      <BookOpen size={22} className='text-black' />
                                                      <div className='mt-2 text-[85%] text-black'>Rules</div>
                                                </div>

                                                <div className="flex flex-col items-center justify-center h-auto py-2.5 w-[23%] bg-white text-black rounded-[9px] cursor-pointer">
                                                      <Search size={22} className='text-black' />
                                                      <div className='mt-2 text-[85%] text-black'>Search</div>
                                                </div>
                                          </div>
                                    </div>

                                    {/* Rules Modal */}
                                    {showRulesModal && (
                                          <div className="fixed inset-0 z-[100] flex items-center justify-center brand-overlay">
                                                <div className="bg-white rounded-xl max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto p-6 relative shadow-lg">
                                                      <button
                                                            className="absolute top-3 py-0! px-2! h-10! w-10! flex items-center justify-center right-3 text-gray-500 hover:text-black"
                                                            onClick={() => setShowRulesModal(false)}
                                                            aria-label="Close rules"
                                                      >
                                                            <X size={24} />
                                                      </button>
                                                      <h2 className="text-xl font-bold mb-4 text-center">Rules</h2>
                                                      <div className="text-sm text-gray-800 text-center space-y-4">
                                                            <p>Welcome To The Big Mamas Edibles Chat Rooms. We Appreciate Your Presence. In Order For This Community To Run In A Safe And Enjoyable Way We Need You To Follow Some Very Easy And Light Hearted Rules.</p>
                                                            <div className="mb-3 mt-8">
                                                                  <div className="font-bold! text-base mb-2">Age Restriction</div>
                                                                  <div>Anyone Under The Age Of 18 Years Is Strictly Prohibited From Visiting The <Link className='text-blue-600' href="/">bigmamasedibles.cc</Link> Website, Downloading The Big Mamas Edibles App Or Using Any Of Our Services.</div>
                                                            </div>
                                                            <div className="mb-3 mt-8">
                                                                  <div className="font-bold! text-base mb-2">Be Nice</div>
                                                                  <div>This Is The Most Important Rule. Please Try Your Best To Be Nice To Each Other. We May Have Different Views And Opinions But It Can Be Talked About In A Peaceful Way. We Understand Sometimes People Get Heated And That’s Okay. Swearing Is Safe We Are All Adults But Dont Be Excessive. Hate Speech, Harassment, Threats, Bullying, Doxing, Intimidation, Discriminatory Language Against Race, Gender, Orientation, Religion, Etc Will Be Judged Individually. Its Best You Don’t Do Any Of These Things If You Want To Stay A Member Of This Community. We Want This Space To Be Welcoming, Not A Warzone.</div>
                                                            </div>
                                                            <div className="mb-3 mt-8">
                                                                  <div className="font-bold! text-base mb-2">Respect The Moderators</div>
                                                                  <div>Our Moderators Are Not The Fun Police. If A Moderator Tells You To Stop Doing Something Please Listen. Our Intention Is Never To Ban Users But This Does Not Mean You Can Take Advantage. Please Show Us The Same Respect That We Show You.</div>
                                                            </div>
                                                            <div className="mb-3 mt-8">
                                                                  <div className="font-bold! text-base mb-2">No Promotion</div>
                                                                  <div>Promoting Any 3Rd Party Links, Names Or Companies Is Strictly Prohibited. Please Refrain From Doing So. This Also Includes Any Self Promotion. We Have Implemented A Link Blocker To Prevent This From Happening. The Honest Reasons Why This Rule Exists Is Because We Worked Hard To Build This Community And We Dont Want Our Platform To Be Used To Promote Anything Or Anyone Else. Also We Want To Prevent Our Community From Any Potential Scams Or Fraud.</div>
                                                            </div>
                                                            <div className="mb-3 mt-8">
                                                                  <div className="font-bold! text-base mb-2">No Extremism</div>
                                                                  <div>This Community Is Cannabis Based. Sharing Your Political Views Is Fine But Extremism Is Not. Promoting Violence Or Extremist Acts Will Not Be Tolerated.</div>
                                                            </div>
                                                            <div className="mb-3 mt-8">
                                                                  <div className="font-bold! text-base mb-2">No Medical Advice</div>
                                                                  <div>Under No Circumstances Should You Diagnose Conditions Or Make Treatment Claims (“This Cures Anxiety,” “This Replaces Meds”) Bad Advice Can Lead To Serious Medical Emergencies So Please Don’t Take The Risk. We Advise Everyone To Do Their Own Research And Make Their Own Decisions Without The Influence Of Others. The Following Is Allowed, Personal Experiences Clearly States As Such, General Education, Opinions And Encouraging Users To Speak With A Licensed Professional.</div>
                                                            </div>
                                                            <div className="mb-3 mt-8">
                                                                  <div className="font-bold! text-base mb-2">No Spam</div>
                                                                  <div>Please Refrain From Repeatedly Posting The Same Text Or Image. If You Have The Time To Spam Our Chat Rooms Then Please Download Indeed And Get Yourself A Job.</div>
                                                            </div>
                                                            <div className="mb-3 mt-8">
                                                                  <div className="font-bold! text-base mb-2">No Sexual Content</div>
                                                                  <div>Put Your Jewels Back In The Bag. We Have Zero Tolerance For Sexual Content. Just Don’t Do It. This Is Not That Kind Of Platform.</div>
                                                            </div>
                                                            <div className="mb-3 mt-8">
                                                                  <div className="font-bold! text-base mb-2">No Sharing Personal Information</div>
                                                                  <div>Please For Your Own Safety Do Not Share Your Personal Information. Your Name, Address, Phone Number, Id Information Etc.</div>
                                                            </div>
                                                            <div className="mb-3 mt-8">
                                                                  <div className="font-bold! text-base mb-2">Report Issues</div>
                                                                  <div>Help Us Keep The Community Healthy By Reporting Rule Violations Or Suspicious Behaviour, Don’t Engage With Trolls Just Let Moderators Handle It. Also If The App Is Having Any Issues Or Glitches Please Also Report This So It Can Be Swiftly Fixed.</div>
                                                            </div>
                                                            <div className="mt-8 mb-3">
                                                                  <div className="font-bold! text-base mb-2">Final Note</div>
                                                                  <div>These Rules Exist To, Protect Our Users, Protect Our Platform And Keep The Community Fun, Informative, And Inclusive. We Reserve The Right To Update These Rules As Features Or Community Needs Evolve. Thanks For Being Part Of Our Community—Stay Respectful, Stay Safe, And Enjoy The Conversation 💚</div>
                                                            </div>
                                                      </div>
                                                </div>
                                          </div>
                                    )}

                                    {/* Description box */}
                                    <div className="px-3 mt-3">

                                          <div className="bg-white rounded-xl p-4 text-sm text-black text-center">
                                                {showChatInfo.description}
                                          </div>


                                          <div className="bg-white rounded-xl mt-3 pt-4 text-sm text-black text-center">
                                                <div className='mb-2 font-bold!'>{userCount.toLocaleString()} Big Mamas Edibles</div>
                                                <Image
                                                      className='w-full rounded-e-xl rounded-l-xl'
                                                      src="/assets/images/group-desc-img.png" alt='group image'
                                                      width={200} height={100} />
                                          </div>


                                          <div className="bg-white rounded-xl mt-3 text-sm text-black text-center">
                                                <ul className="p-4 space-y-3">

                                                      <li
                                                            className="flex justify-between items-center cursor-pointer"
                                                            onClick={() => {
                                                                  const el = document.getElementById('chat-bottom-drawer') as HTMLInputElement
                                                                  if (el) el.checked = true;
                                                                  requestAnimationFrame(() => {
                                                                        document
                                                                              .querySelector('label[for="chat-bottom-drawer"]')
                                                                              ?.classList.add('opacity-100', 'pointer-events-auto')
                                                                  });
                                                                  setShowDescOv(true);
                                                                  handleMuteChat(showChatInfo)
                                                            }}
                                                      >
                                                            <span className="text-left">
                                                                  {isChatMuted(showChatInfo._id) ? 'Unmute' : 'Mute'}
                                                            </span>
                                                            <BellOff className="w-5 h-5" />
                                                      </li>

                                                      <li
                                                            className="flex justify-between items-center cursor-pointer text-red-500"
                                                            onClick={() => {
                                                                  const el = document.getElementById('chat-bottom-drawer') as HTMLInputElement
                                                                  if (el) el.checked = true;
                                                                  requestAnimationFrame(() => {
                                                                        document
                                                                              .querySelector('label[for="chat-bottom-drawer"]')
                                                                              ?.classList.add('opacity-100', 'pointer-events-auto')
                                                                  })
                                                                  setShowDescOv(true);
                                                                  handleClearChat(showChatInfo)
                                                            }}
                                                      >
                                                            <span className="text-left">Clear Chat</span>
                                                            <XCircle className="w-5 h-5 text-red-500" />
                                                      </li>

                                                </ul>
                                          </div>

                                    </div>

                                    {/* Members List */}
                                    {/* <div className="mt-6 px-3">
                                          <h4 className="font-semibold mb-3 text-sm uppercase text-gray-600">Group Members</h4>
                                          <div className="space-y-3">
                                                {showChatInfoObj.members?.map((m: any, i: number) => (
                                                      <div key={i} className="flex items-center gap-3">
                                                            <Image
                                                                  src={m.imageUrl || '/default-avatar.png'}
                                                                  alt={m.name}
                                                                  width={35}
                                                                  height={35}
                                                                  className="rounded-full"
                                                            />
                                                            <span className="text-sm font-medium">{m.name}</span>
                                                      </div>
                                                ))}
                                          </div>
                                    </div> */}
                              </div>
                        )}
                  </div>

                  {showChatMediaObj && (
                        <div
                              className="fixed h-[100vh] inset-0 z-150 bg-white bg-opacity-90"
                        >

                              <div className='flex justify-between items-center w-full h-[7vh]'>
                                    <div
                                          onClick={() => setShowChatMediaObj(null)}
                                          className="text-black text-2xl p-4 mt-1 cursor-pointer w-[25%]"
                                    >
                                          <ChevronLeft />
                                    </div>
                                    <div className='text-center w-[50%]'>
                                          <div className='font-bold!'>Media</div>
                                    </div>
                                    <div className='w-[25%]'></div>
                              </div>

                              <div className='grid grid-cols-3 gap-[1.5px] overflow-y-auto h-[96%] flex-1'>

                                    {
                                          showChatMediaObj.messages.filter(m => m.type == "media").map(me =>
                                                <div className='h-[150px]' key={me.id}>
                                                      <Image
                                                            src={me.mediaUrl!}
                                                            alt="message image"
                                                            height={150}
                                                            width={150}
                                                            className="w-full h-[150px] object-cover cursor-pointer"
                                                            onClick={() => setFullscreenImage({ chatId: showChatMediaObj._id, messageObj: me })}

                                                      />
                                                </div>
                                          )
                                    }

                              </div>

                        </div>
                  )}

                  {fullscreenImage && (
                        <FullScreenImageViewer />
                  )}

                  {/* Chat list */}
                  <div>
                        {chats.map((chat) => (
                              <ChatRow
                                    key={chat._id}
                                    chat={chat}
                                    openSwipe={openSwipe!}
                                    onSwipeOpen={(noChat) => noChat ? setOpenSwipe(null) : setOpenSwipe(chat)}
                                    onEllipsis={() => {
                                          setActiveChat(chat)
                                          const el = document.getElementById('chat-bottom-drawer') as HTMLInputElement
                                          if (el) el.checked = true
                                          requestAnimationFrame(() => {
                                                document
                                                      .querySelector('label[for="chat-bottom-drawer"]')
                                                      ?.classList.add('opacity-100', 'pointer-events-auto')
                                          })
                                    }}
                              />
                        ))}
                  </div>

            </>
      )
}


