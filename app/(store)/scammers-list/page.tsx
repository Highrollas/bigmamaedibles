'use client'

import Link from 'next/link'
import { ArrowRight, Lightbulb, X } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

const ScammersListPage = () => {

      const scamSites = [
            { href: "https://bigmamasediblesuk.cc" },
            { href: "https://bigmamasedibles.uk" },
            { href: "https://bigmamasediblesuk.org" },
      ]

      const [showTipsModal, setShowTipsModal] = useState(false)

      return (
            <div className="px-5">
                  <div className="mx-auto w-full max-w-3xl pt-3 text-center">

                        <h2 className="mt-2 text-3xl font-bold">
                              🚨 Scammers List
                        </h2>

                        <p className="mx-auto mt-8 text-[12px]">
                              The Following Websites Are Scammers. They Impersonate Us To Steal Your Hard Earned Money.
                              Please Stay Vigilant And Aware. When You Loose Money We Feel The Same Pain.
                              We Hate Scammers As Much As You Do.
                        </p>

                        <div className='mt-8'>
                              <button
                                    onClick={() => setShowTipsModal(true)}
                                    className="btn bg-[#f61b23]!"
                              >
                                    <Lightbulb className="h-8 w-8" />
                                    <span>Top Tips To Prevent Scams</span>
                                    <ArrowRight className="h-6 w-6" />
                              </button>
                        </div>

                        {scamSites.map((site) => (
                              <div key={site.href} className="my-8 p-4 text-[13px] rounded-[10px] bg-[#b4b4b4] relative">
                                    <Link
                                          href={site.href}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="font-bold text-blue-700 underline"
                                    >
                                          {site.href}
                                    </Link>

                                    <p className="mx-auto mt-3 max-w-2xl">
                                          The Above Website Is A Scam Site That Impersonates Us.
                                          Please Do Not Hand Any Money Over To These Rats Our Only Real Website Is <Link target='_blank' href="https://bigmamasedibles.cc" className='font-bold text-blue-700 underline'>bigmamasedibles.cc</Link>
                                    </p>

                                    <Image src="/assets/images/scammers-ribbon.png" width={250} height={250} className='w-15 h-auto absolute top-0 left-0' alt="Scammers Ribbon" />

                              </div>
                        ))}


                  </div>

                  {showTipsModal && (

                        <div
                              className="fixed inset-0 z-999999999999 bg-white w-full flex items-start justify-center px-4 pb-0"
                              onClick={() => setShowTipsModal(false)}
                        >
                              <div
                                    className="relative h-[100dvh] overflow-y-auto  w-full max-w-2xl px-5 pt-6 text-left pb-8"
                                    onClick={(e) => e.stopPropagation()}
                              >

                                    <div
                                          onClick={() => setShowTipsModal(false)}
                                          className="absolute top-3 right-3 h-9 w-9 brand-panel rounded flex items-center justify-center"
                                    >
                                          <X className="h-5 w-5 text-white" />
                                    </div>


                                    <div className="space-y-4 text-[14px] mt-10">

                                          <p>
                                                <strong>Domain</strong> <br />
                                                Always Double Check The Domain. It Should Always Say <Link target='_blank' href="https://bigmamasedibles.cc" className='font-bold text-blue-700 underline'>bigmamasedibles.cc</Link> Nothing Else
                                          </p>

                                          <p>
                                                <strong>Bookmark</strong><br />
                                                Add Our Official Site <Link target='_blank' href="https://bigmamasedibles.cc" className='font-bold text-blue-700 underline'>bigmamasedibles.cc</Link> To Your Bookmarks So You Never Loose It
                                          </p>

                                          <p>
                                                <strong>Social Media</strong><br />
                                                Follow Us On Our Verified Social Media Accounts, This Way You Can Always Ask Us
                                                If The Website You Are Using Is Real
                                          </p>

                                          <div>
                                                <p><strong>Check For These Red Flags</strong></p>
                                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                                      <li>Website Looks Like It Was Thrown Together Overnight</li>
                                                      <li>Unrealistically Low Prices</li>
                                                      <li>Poor Grammar Or Strange Wording</li>
                                                      <li>Pressure Tactics Like “Limited Time Today Only”</li>
                                                </ul>
                                          </div>

                                          <p>
                                                <strong>Pressure</strong><br />
                                                We Will Never Contact You Directly Trying To Pressure You Into Buying Something
                                                From Us. Watch Out For This
                                          </p>

                                          <p className='pb-15'>
                                                <strong>Report</strong><br />
                                                To Keep Our Community Safe We Kindly Ask That You Report Any Suspicious
                                                Websites That You May Come Across By <Link className='text-blue-700 font-bold!' href="/contact">Contacting Us</Link> So We Can Add Them To
                                                Our List Of Filthy Scamming Rats
                                          </p>

                                    </div>
                              </div>
                        </div>
                  )}

            </div>
      )
}

export default ScammersListPage


