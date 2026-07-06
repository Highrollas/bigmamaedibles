import {
      Activity,
      Cog,
      FileText,
      History,
      Phone,
      Search,
      ShieldCheck,
      ShieldOff,
      ShoppingBag
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const DonwloadAppPage = () => {
      return (
            <div className="py-5">

                  <div className="px-5">

                        <div className="flex items-center gap-8 mb-5">
                              <Image alt="Big Mamas Edibles" height={100} width={100} src="/assets/images/logo.png" className="w-25 h-25 rounded-2xl" />
                              <div className="text-center">
                                    <div className="font-bold!">Big Mamas Edibles</div>
                                    <div className="text-gray-500 text-[11px] mb-2">High Rolla INC</div>
                                    <div>
                                          <button className="bg-blue-500! text-white py-1! p-0! px-8! rounded-3xl!">How To Download</button>
                                    </div>
                              </div>
                        </div>

                        <hr className="brand-border w-full my-3 border-[1.5px]" />

                        <div className="flex items-center justify-between">

                              <div className="text-center">
                                    <div className="text-[10px] font-bold!"> Devices</div>
                                    <div className="">
                                          <Image alt="Device" height={100} width={100} src="/assets/images/download-app/devices.png" className="w-auto h-5.5 my-1 mx-auto" />
                                    </div>
                                    <div className="text-[8px] font-bold!">iPhone / Android</div>
                              </div>

                              <div className="mx-4 border-l-[3px] brand-border brand-panel h-8"></div>

                              <div className="text-center">
                                    <div className="text-[10px] font-bold!"> Size </div>
                                    <div className="text-[20px] font-bold!">233.1 </div>
                                    <div className="text-[8px] font-bold!">MB</div>
                              </div>

                              <div className="mx-4 border-l-[3px] brand-border brand-panel h-8"></div>

                              <div className="text-center">
                                    <div className="text-[10px] font-bold!"> Language </div>
                                    <div className="text-[20px] font-bold!">EN </div>
                                    <div className="text-[8px] font-bold!">English</div>
                              </div>

                              <div className="mx-4 border-l-[3px] brand-border brand-panel h-8"></div>

                              <div className="text-center">
                                    <div className="text-[10px] font-bold!"> Developer </div>
                                    <div className="">
                                          <Image alt="Developer" height={100} width={100} src="/assets/images/download-app/developer.png" className="w-auto my-1 h-5.5 mx-auto" />
                                    </div>
                                    <div className="text-[8px] font-bold!">High Rolla INC</div>
                              </div>

                        </div>

                        <hr className="brand-border w-full my-3 border-[1.5px]" />
                  </div>

                  <div className="mt-5">
                        <div className="overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory">
                              <div className="flex gap-4 w-full">
                                    <div className="min-w-[60%] snap-center ps-5">
                                          <Image alt="Preview" height={500} width={500} src="/assets/images/download-app/preview-1.png" className="w-full h-auto rounded-2xl" />
                                    </div>
                                    <div className="min-w-[60%] max-w-[70%] snap-center pe-5">
                                          <Image alt="Preview" height={500} width={500} src="/assets/images/download-app/preview-2.png" className="w-full h-auto rounded-2xl" />
                                    </div>
                              </div>
                        </div>
                  </div>


                  <div className="px-5">

                        <div className="mt-4 w-[60%]">
                              <Image alt="Preview" height={500} width={500} src="/assets/images/download-app/preview-3.png" className="w-full h-auto rounded-2xl" />
                        </div>

                        {/* <hr className="brand-border w-full my-3" /> */}

                        <div className="text-[90%] text-center font-bold! w-full border-[3.5px] rounded-3xl p-4 mt-5 my-3">
                              So... We Were Dumb Enough To Create An App.
                              Download The Big Mamas Edibles App To Unlock Exclusive Features That Cant Be Found On The Website. The Same Top-Quality Products, The Same Fair Prices, The Same Friendly Customer Service But Now Its A Lot More Fun, Interactive And Enjoyable.
                        </div>

                        {/* <hr className="brand-border w-full my-3" /> */}

                        <div className="w-full border-[3.5px] rounded-3xl p-4">

                              <div className="w-full flex justify-center">
                                    <ShieldCheck size={30} className="text-blue-500" />
                              </div>

                              <div className="mt-1">
                                    <div className="text-[13px] text-center font-bold!"> Data Linked To You</div>
                                    <div className="text-center text-gray-500 text-[13px]">The following data may be collected and linked to your identity:</div>
                              </div>

                              <div className="flex justify-between gap-3 mt-3">
                                    <div className="flex items-center w-[50%] gap-2">
                                          <ShoppingBag size={18} />
                                          <div className="font-bold! text-[12px]">Purchases</div>
                                    </div>
                                    <div className="flex items-center w-[50%] gap-2">
                                          <Phone size={18} />
                                          <div className="font-bold! text-[12px]">Contact Info</div>
                                    </div>
                              </div>

                              <div className="flex justify-between gap-3 mt-3">
                                    <div className="flex items-center w-[50%] gap-2">
                                          <Search size={18} />
                                          <div className="font-bold! text-[12px]">Search History</div>
                                    </div>
                                    <div className="flex items-center w-[50%] gap-2">
                                          <FileText size={18} />
                                          <div className="font-bold! text-[12px]">User Content</div>
                                    </div>
                              </div>

                              <div className="flex justify-between gap-3 mt-3">
                                    <div className="flex items-center w-[50%] gap-2">
                                          <History size={18} />
                                          <div className="font-bold! text-[12px]">Browser History</div>
                                    </div>
                                    <div className="flex items-center w-[50%] gap-2">
                                          <Activity size={18} />
                                          <div className="font-bold! text-[12px]">Usage Data</div>
                                    </div>
                              </div>

                        </div>


                        <div className="w-full border-[3.5px] rounded-3xl p-4 mt-3">

                              <div className="w-full flex justify-center">
                                    <ShieldOff size={30} className="text-blue-500" />
                              </div>

                              <div className="mt-1">
                                    <div className="text-[13px] text-center font-bold!"> Data Not Linked To You</div>
                                    <div className="text-center text-gray-500 text-[13px]">The following data may be collected but is not linked to your identity:</div>
                              </div>

                              <div className="flex justify-center  items-center gap-2 mt-3">
                                    <Cog size={18} />
                                    <div className="font-bold! text-[12px]">Diagnostics</div>
                              </div>

                        </div>

                        {/* <hr className="brand-border w-full my-3" /> */}

                        <div className="text-center font-bold! my-7">Overview</div>

                        <div>

                              <div className="flex justify-between mt-0">
                                    <div className="font-bold! text-[12px]">Developer</div>
                                    <div className="text-[12px] font-bold!">High Rolla INC</div>
                              </div>

                              <div className="flex justify-between mt-3">
                                    <div className="font-bold! text-[12px]">Size</div>
                                    <div className="text-[12px] font-bold!">233.1</div>
                              </div>

                              <div className="flex justify-between mt-3">
                                    <div className="font-bold! text-[12px]">Category</div>
                                    <div className="text-[12px] font-bold!">Canabis Dispensary</div>
                              </div>

                              <div className="flex justify-between mt-3">
                                    <div className="font-bold! text-[12px]">Language</div>
                                    <div className="text-[12px] font-bold!">English (EN)</div>
                              </div>

                              <div className="flex justify-between mt-3">
                                    <div className="font-bold! text-[12px]">Copyright</div>
                                    <div className="text-[12px] font-bold!">High Rolla INC</div>
                              </div>

                              <div className="flex justify-between mt-3">
                                    <div className="font-bold! text-[12px]">Report A Problem</div>
                                    <Link href="/contact" className="font-bold! text-blue-700 text-[12px]">Contact us</Link>
                              </div>

                        </div>
                  </div>

            </div>
      )
}

export default DonwloadAppPage

