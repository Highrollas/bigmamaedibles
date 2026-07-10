import Heading from "../components/server/partials/Heading";
import ProductListSlider from "../components/server/ProductListSlider";
import BlockSection from "../components/server/BlockSection";
import Link from "next/link";
import { fetchNewStock, fetchProductsByCategory } from "@/queries/products";
import { DEFAULT_METAOBJ } from "@/constants";
// import TrustpilotWidget from "../components/client/TrustpilotWidget";
// import Product from "@/models/Products";

export const revalidate = 60;

export default async function Home() {

      const newStocks = await fetchNewStock();
      const cheekyDeals = await fetchProductsByCategory("Cheeky Deals");
      const bundles = await fetchProductsByCategory("Bundles");
      const edibles1000mg = await fetchProductsByCategory("Edibles 1000mg", 6);
      const edibles500mg = await fetchProductsByCategory("Edibles 500mg", 6);

      // const upd = await Product.updateMany({ categories: "Pod" }, { costPrice: 11 });
      // console.log(upd);

      return (
            <>

                  <div className="flex my-10">
                        <div className="w-[100%] sm:w-[80%] mx-auto overflow-hidden">
                              <Heading>New Stock</Heading>
                              <ProductListSlider products={newStocks} />
                        </div>
                  </div>

                  <div className="flex my-10">
                        <div className="w-[90%] sm:w-[80%] mx-auto">
                              <BlockSection title="How To Order" imageUrl="/assets/images/how-to-order.png">
                                    <Heading>How To Order</Heading>
                                    <p>Are You Feeling A Little Lost? Not To Worry. Click The Link Below To Watch Our Step By Step Tutorial Slides On How To Place Your Order</p>
                                    <div className="mt-5 mb-10">
                                          <Link className='text-blue-700 font-bold text-[90%] underline mt-4' href="/how-to-order">Tutorials</Link>
                                    </div>
                              </BlockSection>
                        </div>
                  </div>



                  <div className="flex my-10">
                        <div className="w-[100%] sm:w-[80%] mx-auto overflow-hidden">
                              <Heading>Cheeky Deals</Heading>
                              <ProductListSlider products={cheekyDeals} />
                        </div>
                  </div>


                  {/* <div className="flex my-10">
                        <div className="w-[90%] sm:w-[80%] mx-auto">

                              <div className="my-5">
                                    <div className="flex flex-wrap border-3 bg-[#e21893] border-[#e21893] rounded-md'>
                                          <div className="w-[100%] sm:w-[50%] flex h-[180px] sm:h-[300px] items-center justify-center">

                                                <TrustpilotWidget />

                                          </div>
                                          <div className="w-[100%] sm:w-[50%] rounded-r-sm rounded-l-sm flex justify-center flex-col text-center px-5 sm:px-12 text-[16px]! bg-white">
                                                <Heading>Reviews</Heading>
                                                <p className="mt-3">
                                                      Check Out Our Trustpilot To See What People Think Of Us By Clicking The Link Below. If You Have Already Ordered From Us Before Then Go Drop Us A Review
                                                </p>
                                                <div className="mt-5 mb-10">
                                                      <Link target="_blank" className='text-blue-700 font-bold text-[90%] underline mt-4' href="https://uk.trustpilot.com/review/bigmamasedibles.cc">Trustpilot</Link>
                                                </div>
                                          </div>
                                    </div >
                              </div>
                        </div>
                  </div> */}

                  <div className="flex my-10">
                        <div className="w-[90%] sm:w-[80%] mx-auto">
                              <BlockSection title="How To Order" imageUrl="/assets/images/review-card.jpg">
                                    <Heading>Reviews</Heading>
                                    <p className="mt-3">
                                          Check Out Our Trustpilot To See What People Think Of Us By Clicking The Link Below. If You Have Already Ordered From Us Before Then Go Drop Us A Review
                                    </p>
                                    <div className="mt-5 mb-10">
                                          <Link target="_blank" className='text-blue-700 font-bold text-[90%] underline mt-4' href="https://uk.trustpilot.com/review/bigmamasedibles.cc">Trustpilot</Link>
                                    </div>
                              </BlockSection>
                        </div>
                  </div>


                  <div className="flex my-10">
                        <div className="w-[100%] sm:w-[80%] mx-auto overflow-hidden">
                              <Heading>Bundles</Heading>
                              <ProductListSlider products={bundles} />
                        </div>
                  </div>


                  <div className="flex my-10">
                        <div className="w-[90%] sm:w-[80%] mx-auto">
                              <BlockSection title="Create An Account" imageUrl="/assets/images/create-account-home-1.png">
                                    <Heading>Create An Account</Heading>
                                    <p className="mt-3">-Pick An Avatar</p>
                                    <p className="mt-3">-Save Your Addresses For Faster Checkout</p>
                                    <p className="mt-3">-View The Status Of Your Orders</p>
                                    <p className="mt-3">– Weekly Stock Updates</p>
                                    <p className="mt-3">-Discounts And Promotional Offers</p>
                                    <p className="mt-3">-Unique Referral Link To Invite Your Friends And Earn Money</p>
                                    <div className="mt-5 mb-10">
                                          <Link className='text-blue-700 font-bold text-[90%] underline mt-4' href="/account/register">Create Account</Link>
                                    </div>
                              </BlockSection>
                        </div>
                  </div>



                  <div className="flex my-10">
                        <div className="w-[100%] sm:w-[80%] mx-auto overflow-hidden">
                              <Heading>Edibles 1000mg</Heading>
                              <ProductListSlider products={edibles1000mg} />
                        </div>
                  </div>


                  <div className="flex my-10">
                        <div className="w-[90%] sm:w-[80%] mx-auto">
                              <BlockSection title="Contact Us" imageUrl="/assets/images/contact-home.png">
                                    <Heading>Contact Us</Heading>
                                    <p className="mt-3">
                                          Have A Question Or A Problem With Your Order? Don’t Be Shy, Get In Touch With Us. We’re Here To Help
                                    </p>
                                    <div className="mt-5 mb-10">
                                          <Link className='text-blue-700 font-bold text-[90%] underline mt-4' href="/contact">Contact Us</Link>
                                    </div>
                              </BlockSection>
                        </div>
                  </div>


                  <div className="flex my-10">
                        <div className="w-[100%] sm:w-[80%] mx-auto overflow-hidden">
                              <Heading>Eddibles 500mg</Heading>
                              <ProductListSlider products={edibles500mg} />
                        </div>
                  </div>

            </>




      );
}

export const metadata = DEFAULT_METAOBJ


