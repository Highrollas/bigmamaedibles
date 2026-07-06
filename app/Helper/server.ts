/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { AdminObj, AuthUser, BlogObj, CategoryObj, OrderObj, ProductObj, UserObj, VoucherObj } from "@/Interface";
import { cookies } from "next/headers";
import { verifyToken } from ".";
import User from "@/models/User";
import Products from "@/models/Products";
import { ClientSession } from "mongoose";
import Admin from "@/models/Admin";
import Category from "@/models/Category";
import { APP_URL, DEFAULT_METAOBJ } from "@/constants";
import Voucher from "@/models/Voucher";
import Posts from "@/models/Posts";
import { Metadata } from "next";


export async function getAuthFromToken(): Promise<AuthUser | false> {
      try {
            const cookieStore = await cookies()
            const token = cookieStore.get('auth_token') || cookieStore.get('guest_token');
            return await verifyToken(token!.value, String(process.env.JWT_SECRET));
      } catch (error) {
            console.error("catch error @getAuthFromToken", error);
            return false;
      }
}

export async function getTokenObj(token: string, secret: string) {
      try {
            return await verifyToken(token, secret);
      } catch (error) {
            console.error("catch error @getTokenObj", error);
            return false;
      }
}

export async function getUserFromSession(): Promise<UserObj | null> {
      try {
            const cookieStore = await cookies();
            const cookie = cookieStore.get('auth_token');
            if (cookie) {
                  const token = cookie.value;
                  const { _id } = await verifyToken(token, String(process.env.JWT_SECRET));
                  return await User.findOne({ _id, token }).lean<UserObj>() as UserObj;
            } else {
                  return null;
            }
      } catch (error) {
            console.error("catch error @getUserFromSession", error);
            return null;
      }
}


export async function generateProductMetadata({ params }: { params: { slug: string } }) {

      if (!params.slug || params.slug == "no-slug" || params.slug == "") {
            return {
                  title: "Product Not Found - High Rolla",
                  description: "The product you are looking for does not exist.",
            };
      }

      const productObj: ProductObj | null = await Products.findOne({ slug: params.slug }).lean<ProductObj>();

      if (!productObj) {
            return {
                  title: "Product Not Found - High Rolla",
                  description: "The product you are looking for does not exist.",
            };
      }

      return {
            title: `${productObj.name} - Big Mamas Edibles`,
            description: productObj?.metadata?.description || 'Big Mamas Edibles',
            keywords: productObj?.metadata?.keywords || 'High Rolla',
            appleWebApp: {
                  title: "Big Mamas Edibles",
                  capable: true,
            },
            openGraph: {
                  title: `${productObj.metadata?.ogTitle || productObj.name} - Big Mamas Edibles`,
                  description: productObj?.metadata?.description || "",
                  url: APP_URL + `/product/${productObj.slug}`,
                  siteName: "Big Mamas Edibles",
                  images: [
                        {
                              url: productObj.images[0],
                              width: 60,
                              height: 60,
                              alt: productObj.name,
                        },
                        {
                              url: productObj.images[0],
                              width: 1200,
                              height: 630,
                              alt: productObj.name,
                        }
                  ],

            },
            twitter: {
                  card: "summary_large_image",
                  title: `${productObj.metadata?.ogTitle || productObj.name} - Big Mamas Edibles`,
                  description: productObj.metadata?.description || "",
                  images: [productObj.images[0]],
            },
      };
}

export async function generateBlogMetadata({ params }: { params: { slug: string } }) {

      if (!params.slug || params.slug == "no-slug" || params.slug == "") {
            return {
                  title: "Blog Not Found - High Rolla",
                  description: "The blog you are looking for does not exist.",
            };
      }

      const blogObj: BlogObj | null = await Posts.findOne({ slug: params.slug }).lean<BlogObj>();

      if (!blogObj) {
            return {
                  title: "Blog Not Found - High Rolla",
                  description: "The blog you are looking for does not exist.",
            };
      }

      return {
            title: `${blogObj.title} - Big Mamas Edibles`,
            description: blogObj?.metadata?.description || 'Big Mamas Edibles',
            keywords: blogObj?.metadata?.keywords || 'High Rolla',
            appleWebApp: {
                  title: "Big Mamas Edibles",
                  capable: true,
            },
            openGraph: {
                  title: `${blogObj.metadata?.ogTitle || blogObj.title} - Big Mamas Edibles`,
                  siteName: "Big Mamas Edibles",
                  url: APP_URL + `${blogObj.type == "blog" ? '/blog' : ''}/${blogObj.slug}`,
                  description: blogObj?.metadata?.description || "",
                  images: [
                        {
                              url: blogObj.coverImage,
                              width: 1200,
                              height: 630,
                              alt: blogObj.title,
                        },
                        {
                              url: blogObj.coverImage,
                              width: 60,
                              height: 60,
                              alt: blogObj.title,
                        }
                  ],
            },
            twitter: {
                  card: "summary_large_image",
                  title: `${blogObj.metadata?.ogTitle || blogObj.title} - Big Mamas Edibles`,
                  description: blogObj.metadata?.description || "",
                  images: [blogObj.coverImage],
            },
      }
}

export async function generateCategoryMetadata({ params }: { params: { slug: string } }) {

      const categoryObj: CategoryObj | null = await Category.findOne({ slug: params.slug }).lean<CategoryObj>();

      if (!categoryObj) {
            return {
                  title: "Product Not Found - High Rolla",
                  description: "The product you are looking for does not exist.",
                  ...DEFAULT_METAOBJ
            };
      }

      const metadata = categoryObj.metadata || DEFAULT_METAOBJ;


      return {
            title: metadata.title,
            description: metadata.description,
            keywords: metadata.keywords,
            openGraph: {
                  title: metadata.ogTitle || metadata.title,
                  description: metadata.description,
                  images: DEFAULT_METAOBJ.openGraph?.images,
            },
            twitter: {
                  card: "summary_large_image",
                  title: metadata.ogTitle || metadata.title,
                  description: metadata.description,
                  images: DEFAULT_METAOBJ.twitter?.images
            }
      };
}

export async function getAdminFromSession(): Promise<AdminObj | null> {
      try {
            const cookieStore = await cookies();
            const cookie = cookieStore.get('admin_auth_token');
            if (cookie) {
                  const token = cookie.value;
                  const { _id } = await verifyToken(token, String(process.env.ADMIN_JWT_SECRET));
                  return await Admin.findOne({ _id, token }).lean<AdminObj>() as AdminObj;
            } else {
                  return null;
            }
      } catch (error) {
            console.error("catch error @getAdminFromSession", error);
            return null;
      }
}


export async function generateRandomCouponString(): Promise<string> {
      const prefix = "HR";
      const getRandomBlock = () => Math.floor(100 + Math.random() * 900).toString(); // 3-digit number from 100–999
      return `${prefix}-${getRandomBlock()}-${getRandomBlock()}-${getRandomBlock()}`;
}


export async function fetchProductObj(queryObj: Record<string, unknown>, session?: ClientSession): Promise<ProductObj | null> {
      try {
            const productObj = await Products.findOne({ ...queryObj })
                  .session(session || null)
                  .lean<ProductObj>();
            return productObj || null;
      } catch (error) {
            return null;
      }
}

export async function reductProductStock(_id: string, count?: number): Promise<boolean> {
      const qty = count || 1;
      const result = await Products.updateOne(
            { _id },
            [
                  {
                        $set: {
                              stockQty: {
                                    $max: [{ $subtract: ["$stockQty", qty] }, 0]
                              }
                        }
                  }
            ]
      );
      return result.modifiedCount > 0;
}

export const reduceOrderItemsStock = async (order: OrderObj) => {
      for (const item of order.cartItems) {
            const { productType, cartQty, bundleVariation, cheekyVariation, productObj } = item;

            if (productType === "Bundles" && bundleVariation?.selectFields?.length) {
                  // Reduce stock for each selected field in bundle
                  for (const sf of bundleVariation.selectFields) {
                        await reductProductStock(sf.productId, cartQty);
                        // cartQty since each selected product is chosen once per bundle
                  }

            } else if (productType === "CheekyDeals" && cheekyVariation?.length) {
                  // Reduce stock for each selected field in all cheeky variations
                  for (const variation of cheekyVariation) {
                        for (const sf of variation.selectFields) {
                              await reductProductStock(sf.productId, cartQty);
                              // Again, cartQty times since buyer picked one of each
                        }
                  }

            } else {
                  // Single product: reduce main productObj stock
                  await reductProductStock(productObj._id, cartQty);
            }
      }
}

export const payOrderCommission = async (order: OrderObj) => {
      if (order.coupons && order.coupons.length > 0) {
            for (const coupon of order.coupons) {

                  const voucher = await Voucher.findOne({ code: new RegExp(`^${coupon.code}$`, "i") }).lean<VoucherObj>();

                  if (voucher && voucher.voucherType === "referral") {
                        // pay commission to the user who referred this order
                        const referralUser = await User.findOne({ coupon: voucher.code.toUpperCase() }).lean<UserObj>();
                        if (referralUser) {

                              const newBalance = (parseFloat(referralUser.balance) || 0) + 10;
                              await User.updateOne(
                                    { _id: referralUser._id },
                                    { $set: { balance: newBalance.toString() } }
                              );

                              //set the refcoupon to used for the user
                              await User.updateOne(
                                    { email: order.billingObj.email },
                                    { $set: { referralCouponUsed: true } }
                              )

                        }
                  }
            }
      }
}

export const refundOrderCommission = async (order: OrderObj) => {
      if (order.coupons && order.coupons.length > 0) {
            for (const coupon of order.coupons) {

                  const voucher = await Voucher.findOne({ code: new RegExp(`^${coupon.code}$`, "i") }).lean<VoucherObj>();

                  if (voucher && voucher.voucherType === "referral") {
                        // refund commission from the user who referred this order
                        const referralUser = await User.findOne({ coupon: voucher.code.toUpperCase() }).lean<UserObj>();
                        if (referralUser) {
                              const newBalance = (parseFloat(referralUser.balance) || 0) - 10;
                              await User.updateOne(
                                    { _id: referralUser._id },
                                    { $set: { balance: newBalance.toString() } }
                              );
                        }
                  }
            }
      }
}


export async function convertGBPtoEUR(amount: number): Promise<string> {
      const url = 'https://api.exchangerate-api.com/v4/latest/GBP';
      let exchangeRate = 1.16; // fallback rate

      try {
            const response = await fetch(url);
            if (!response.ok) {
                  throw new Error('API request failed');
            }

            const data = await response.json();
            if (!data.rates?.EUR) {
                  throw new Error('Invalid API response');
            }

            exchangeRate = data.rates.EUR;
      } catch (error) {
            console.error('Error retrieving exchange rate: fixed rate used');
      }

      return (amount * exchangeRate).toFixed(2);
}

export const rollbackOrderUsedParams = async (existingOrder: OrderObj) => {

      // refund balance if used
      if (parseFloat(existingOrder.useBalance) > 0) {
            const user = await User.findOne({ _gid: existingOrder._gid }).lean<UserObj>();
            if (user) {
                  await User.updateOne({ _gid: existingOrder._gid }, { balance: parseFloat(user.balance) + parseFloat(existingOrder.useBalance) })
            }
      }

      // rollback vouchers if used
      if (existingOrder.coupons && existingOrder.coupons.length > 0) {
            for (const coupon of existingOrder.coupons) {
                  const voucher = await Voucher.findOne({ code: new RegExp(`^${coupon.code}$`, "i") }).lean<VoucherObj>();

                  if (voucher) {
                        await Voucher.updateOne(
                              { _id: voucher._id },
                              {
                                    $inc: { usageCount: -1 }, // decrement by 1
                                    $pull: { usageUserIds: existingOrder._gid }, // remove user's gid
                              }
                        );
                  }
            }
      }


}

