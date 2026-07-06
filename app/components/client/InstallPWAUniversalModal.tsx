/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

const InstallPWAUniversalModal: React.FC = () => {

      const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
      const [showAndroidModal, setShowAndroidModal] = useState(false)
      const [showIosModal, setShowIosModal] = useState(false)

      useEffect(() => {
            // Android Chrome: beforeinstallprompt
            const handleBeforeInstallPrompt = (e: Event) => {
                  e.preventDefault()
                  setDeferredPrompt(e as BeforeInstallPromptEvent)
                  setShowAndroidModal(true)
            }
            window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

            // iOS Safari detection
            const userAgent = window.navigator.userAgent
            const isIos = /iPad|iPhone|iPod/.test(userAgent)
            const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent)
            const isStandalone = (window.navigator as any).standalone === true

            if (isIos && isSafari && !isStandalone) {
                  setShowIosModal(true)
            }

            return () => {
                  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
            }
      }, [])

      const handleInstall = async () => {
            if (!deferredPrompt) return
            deferredPrompt.prompt()
            setDeferredPrompt(null)
            setShowAndroidModal(false)
      }

      const closeAndroidModal = () => setShowAndroidModal(false)
      const closeIosModal = () => setShowIosModal(false)

      return (
            <>
                  {(showAndroidModal || showIosModal) && (

                        <div className="fixed inset-0 px-5 z-[999999] flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
                              <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center relative">

                                    {/* Close button */}
                                    <div onClick={showAndroidModal ? closeAndroidModal : closeIosModal}
                                          className="absolute top-3 right-3 text-black font-bold! text-[120%]">✕</div>

                                    {/* Logo */}
                                    <Image
                                          src="/logo.png"  // replace with your logo path
                                          alt="Bigmamasedibles Logo"
                                          width={100}
                                          height={100}
                                          className="mx-auto mb-4 rounded-full shadow"
                                    />

                                    {/* Title */}
                                    <h2 className="text-xl font-semibold mb-2">Install Bigmamasedibles App</h2>

                                    {/* Android modal */}
                                    {showAndroidModal && (
                                          <>
                                                <p className="text-gray-600 mb-4">
                                                      Get the best experience by adding us to your home screen.
                                                </p>
                                                <button
                                                      onClick={handleInstall}
                                                      className="btn w-full text-white"
                                                >
                                                      Install Now
                                                </button>
                                          </>
                                    )}

                                    {/* iOS modal */}
                                    {showIosModal && (
                                          <>
                                                <p className="text-gray-600 mb-4">
                                                      Open Site On Safari Then Click <span className="font-semibold">Share</span> Then{' '}
                                                      <span className="font-semibold">Add to Home Screen</span> To Install.
                                                </p>

                                          </>
                                    )}
                              </div>
                        </div>
                  )}
            </>
      )
}

export default InstallPWAUniversalModal

// type for Android event
interface BeforeInstallPromptEvent extends Event {
      prompt: () => Promise<void>
      userChoice: Promise<{
            outcome: 'accepted' | 'dismissed'
            platform: string
      }>
}
