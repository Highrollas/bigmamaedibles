'use client'

import { paymentMethodTutorial } from '@/constants/payments'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { use, useState } from 'react'

interface PageProps {
      params: Promise<{ alias: string }>
}

interface PopupItem {
      image: string
      text: string
}

const PaymentTutorialPage = ({ params }: PageProps) => {
      const { alias } = use(params)
      const [showPopup, setShowPopup] = useState(false)
      const [currentPopups, setCurrentPopups] = useState<PopupItem[]>([])
      const [currentIndex, setCurrentIndex] = useState(0)
      const [popupTitle, setPopupTitle] = useState('')
      const [touchStart, setTouchStart] = useState(0)
      const [touchEnd, setTouchEnd] = useState(0)
      const [isTransitioning, setIsTransitioning] = useState(false)

      const paymentMethod = paymentMethodTutorial.find(p => p.alias === alias)

      if (!paymentMethod) {
            notFound()
      }

      const openPopup = (popups: PopupItem[] | undefined, title: string) => {
            if (popups && popups.length > 0) {
                  setCurrentPopups(popups)
                  setPopupTitle(title)
                  setCurrentIndex(0)
                  setShowPopup(true)
            }
      }

      const closePopup = () => {
            setShowPopup(false)
            setCurrentIndex(0)
      }

      const nextSlide = () => {
            if (isTransitioning) return
            setIsTransitioning(true)
            setCurrentIndex((prev) => (prev + 1) % currentPopups.length)
            setTimeout(() => setIsTransitioning(false), 600)
      }

      const prevSlide = () => {
            if (isTransitioning) return
            setIsTransitioning(true)
            setCurrentIndex((prev) => (prev - 1 + currentPopups.length) % currentPopups.length)
            setTimeout(() => setIsTransitioning(false), 600)
      }

      const handleTouchStart = (e: React.TouchEvent) => {
            setTouchStart(e.targetTouches[0].clientX)
      }

      const handleTouchEnd = (e: React.TouchEvent) => {
            setTouchEnd(e.changedTouches[0].clientX)
            handleSwipe(e)
      }

      const handleSwipe = (e: React.TouchEvent) => {
            if (isTransitioning) return
            const distance = touchStart - touchEnd
            const isLeftSwipe = distance > 50
            const isRightSwipe = distance < -50

            if (isLeftSwipe) {
                  nextSlide()
            } else if (isRightSwipe) {
                  prevSlide()
            }
      }

      return (
            <div className='w-[90%] sm:w-[80%] lg:w-[60%] mx-auto py-6'>

                  {paymentMethod.image && paymentMethod.image != "" &&
                        < div className="flex justify-center mb-8">
                              <Image
                                    width={400}
                                    height={200}
                                    alt={paymentMethod.name}
                                    src={paymentMethod.image}
                                    className="max-w-[80%] sm:max-w-[400px] w-auto h-auto"
                              />
                        </div>
                  }

                  {/* Description */}
                  <div className="text-center mb-8">
                        <p className="text-base text-[90%] font-medium px-4">
                              This Tutorial Has Two Parts. Part 1 Shows You How To Create Your {paymentMethod.name} Account. Part 2 Shows You How To Use Your {paymentMethod.name} Account To Place Your Order. Click Below To Get Started.
                        </p>
                  </div>

                  {/* Cards */}
                  <div className="flex gap-8 justify-center items-center mb-8 scale-85">

                        {/* Creating Account Card */}
                        {paymentMethod.imageIcon && paymentMethod.cardColor && (
                              <div
                                    onClick={() => openPopup(paymentMethod.accountPopups, 'Creating Account')}
                                    className="w-[45%] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                                    style={{ backgroundColor: paymentMethod.cardColor }}
                              >
                                    <div className="rounded-full h-26 flex items-center justify-center mb-6">
                                          <Image
                                                width={80}
                                                height={80}
                                                alt="Creating Account"
                                                src={paymentMethod.imageIcon}
                                                className="w-[80%] h-auto"
                                          />
                                    </div>
                                    <p className="text-white text-[80%] font-bold!">Creating Account</p>
                              </div>
                        )}

                        {/* Placing Order Card */}
                        <div
                              onClick={() => openPopup(paymentMethod.orderPopups, 'Placing Order')}
                              className="w-[45%] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                              style={{ backgroundColor: paymentMethod.cardColor || '#5741d9' }}
                        >
                              <div className="rounded-full h-26 flex items-center justify-center mb-6">
                                    <Image
                                          width={80}
                                          height={80}
                                          alt="Placing Order"
                                          src="/assets/images/cart-box-white.png"
                                          className="w-[75%] h-auto"
                                    />
                              </div>
                              <h3 className="text-white text-[80%] font-bold!">Placing Order</h3>
                        </div>

                  </div>

                  {/* Contact Us */}
                  <div className="text-center">
                        <p className="text-base text-[90%]">
                              This Tutorial Is For iPhones But Its The Exact Same For Androids.
                              If Your Still Struggling After Watching This Tutorial, You Can{' '}
                              <Link href="/contact" className="text-blue-600 underline font-bold! hover:text-blue-800">
                                    Contact Us
                              </Link>
                              {' '}And We Will Help 😎
                        </p>
                  </div>

                  {/* Popup Modal */}
                  {
                        showPopup && currentPopups.length > 0 && (
                              <div className="fixed bg-white inset-0 h-screen w-full bg-opacity-75 flex pt-6 justify-center z-[99999999999999] p-4">
                                    <div
                                          className="brand-panel rounded-lg max-w-4xl w-full overflow-hidden relative"
                                          onTouchStart={handleTouchStart}
                                          onTouchEnd={handleTouchEnd}
                                    >

                                          {/* Close Button */}
                                          <div
                                                onClick={closePopup}
                                                className="absolute top-4 right-4 z-10 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold"
                                          >
                                                <X className="w-7 h-7 text-white" stroke='white' />
                                          </div>

                                          {/* Header */}
                                          <div className="brand-panel p-4 border-b">
                                                <h2 className="text-xl font-bold text-center text-white">{popupTitle}</h2>
                                          </div>

                                          {/* Content */}
                                          <div className="px-6 pt-2">
                                                {/* Horizontal scrolling container */}
                                                <div className="mb-6 relative overflow-x-hidden h-80">
                                                      <div
                                                            className="flex transition-transform duration-500 ease-in-out "
                                                            style={{
                                                                  transform: `translateX(-${currentIndex * 100}%)`,
                                                            }}
                                                      >
                                                            {currentPopups.map((popup, index) => (
                                                                  <div key={index} className="flex-shrink-0 h-max w-full">
                                                                        <Image
                                                                              src={popup.image}
                                                                              alt={`Step ${index + 1}`}
                                                                              width={1200}
                                                                              height={1200}
                                                                              className="w-full h-80 bg-white object-contain rounded-lg"
                                                                        />
                                                                  </div>
                                                            ))}
                                                      </div>
                                                </div>

                                                <div className="flex items-center justify-between px-2 my-6">
                                                      <ChevronLeft onClick={prevSlide} className="w-5 h-5 text-white" />
                                                      <p className="text-center text-[16px] text-white mt-2 font-bold!">
                                                            Step {currentIndex + 1}
                                                      </p>
                                                      <ChevronRight onClick={nextSlide} className="w-5 h-5 text-white" />
                                                </div>

                                                {/* Text container with scroll effect */}
                                                <div className="overflow-hidden">
                                                      <div
                                                            className="flex transition-transform duration-500 ease-in-out"
                                                            style={{
                                                                  transform: `translateX(-${currentIndex * 100}%)`,
                                                            }}
                                                      >
                                                            {currentPopups.map((popup, index) => (
                                                                  <div key={index} className="flex-shrink-0 w-full">
                                                                        <p className="text-white text-center px-4 text-[12px]">
                                                                              {popup.text}
                                                                        </p>
                                                                  </div>
                                                            ))}
                                                      </div>
                                                </div>
                                          </div>

                                    </div>

                              </div>
                        )
                  }

            </div >
      )
}

export default PaymentTutorialPage


