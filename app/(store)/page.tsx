import Heading from "../components/server/partials/Heading";
import ProductListSlider from "../components/server/ProductListSlider";
import BlockSection from "../components/server/BlockSection";
import Link from "next/link";
import { fetchNewStock, fetchProductsByCategory } from "@/queries/products";
import { DEFAULT_METAOBJ } from "@/constants";
import TrustpilotWidget from "../components/client/TrustpilotWidget";
// import Product from "@/models/Products";

export const revalidate = 60;

export default async function Home() {

      const newStocks = await fetchNewStock();
      const cheekyDeals = await fetchProductsByCategory("Cheeky Deals");
      const bundles = await fetchProductsByCategory("Bundles");
      const vapes = await fetchProductsByCategory("Vapes", 6);
      const edibles = await fetchProductsByCategory("Edibles");
      const mixers = await fetchProductsByCategory("Mixers");
      const accessories = await fetchProductsByCategory("Accessories");

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

                  <div className="flex my-10">
                        <div className="w-[90%] sm:w-[80%] mx-auto">
                              <BlockSection title="Create An Account" imageUrl="/assets/images/create-account-home-ed.png">
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
                              <Heading>Bundles</Heading>
                              <ProductListSlider products={bundles} />
                        </div>
                  </div>


                  <div className="flex my-10">
                        <div className="w-[90%] sm:w-[80%] mx-auto">
                              <BlockSection title="Bundles" imageUrl="/assets/images/bundles-home.png">
                                    <Heading>Bundles</Heading>
                                    <p className="mt-3">
                                          Did You Know You Can Buy Larger Quantities Of Your Favourite Products At Lower Prices? But Thats Not All, You Get To Mix And Match Strains / Products And The Prices Stays Low!
                                    </p>
                                    <div className="mt-5 mb-10">
                                          <Link className='text-blue-700 font-bold text-[90%] underline mt-4' href="/product-category/bundles">Bundles</Link>
                                    </div>
                              </BlockSection>
                        </div>
                  </div>



                  {/* <div className="flex my-10">
                        <div className="w-[100%] sm:w-[80%] mx-auto overflow-hidden">
                              <Heading>Vapes</Heading>
                              <ProductListSlider products={vapes} />
                        </div>
                  </div> */}

                  {/* 
                  <div className="flex my-10">
                        <div className="w-[90%] sm:w-[80%] mx-auto">

                              <div className="my-5">
                                    <div className='brand-panel-secondary flex flex-wrap border-3 brand-border-secondary rounded-md'>
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
                        <div className="w-[100%] sm:w-[80%] mx-auto overflow-hidden">
                              <Heading>Edibles 1000mg</Heading>
                              <ProductListSlider products={edibles} />
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
                              <ProductListSlider products={accessories} />
                        </div>
                  </div>

            </>




      );
}

export const metadata = DEFAULT_METAOBJ

