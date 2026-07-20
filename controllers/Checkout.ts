/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendFirstErrorMessage } from "@/app/Helper";
import { convertGBPtoEUR, fetchProductObj, getAuthFromToken, getUserFromSession, reduceOrderItemsStock } from "@/app/Helper/server";
import { APP_URL, CURRENCY_SYMBOL, DELIVERY_METHODS, FREE_DELIVERY_MIN_AMOUNT, GATEWAY_ENDPOINT, PAYMENT_METHODS, TEMPLATE_MAP } from "@/constants";
import { VoucherObj, ITransaction, selectField, OrderObj } from "@/Interface";
import Order from '@/models/Order'
import Voucher from "@/models/Voucher";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import { CheckoutSchema } from "@/schema";
import mongoose, { ClientSession } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import Counter from "@/models/Counter";
import { sendEmail } from "@/libs/emailService";

async function runWithRetry<T>(fn: (session: ClientSession) => Promise<T>, retries = 6): Promise<T> {
      for (let attempt = 1; attempt <= retries; attempt++) {
            const session = await mongoose.startSession();
            try {
                  session.startTransaction();

                  const result = await fn(session);

                  await session.commitTransaction();
                  return result;

            } catch (err: any) {

                  await session.abortTransaction();

                  // transient errors / write conflicts
                  if (
                        attempt < retries &&
                        (err?.errorLabels?.includes("TransientTransactionError") ||
                              err?.codeName === "WriteConflict" ||
                              err?.code === 112) // 112 = WriteConflict
                  ) {
                        // Add random delay between 1-3 seconds before retrying
                        const delay = 1000 + Math.floor(Math.random() * 2000);
                        await new Promise(res => setTimeout(res, delay));
                        continue;
                  }

                  throw err; // rethrow non-retryable error

            } finally {
                  session.endSession();
            }
      }
      throw new Error("Transaction failed after max retries");
}

async function createOnrampPaymentLink({
      amount,
      email,
      orderId,
      origin,
}: {
      amount: number;
      email: string;
      orderId: string;
      origin: string;
}) {
      const merchantAddress = process.env.ONRAMP_PAY_MERCHANT_ADDRESS;
      if (!merchantAddress) {
            throw new Error("Onramp Pay Merchant Address Is Not Configured");
      }

      const callbackUrl = `${APP_URL || origin}/api/onramp-pay/webhook/${orderId}`;
      const walletResp = await axios.get("https://api.onramp-pay.com/control/wallet.php", {
            params: {
                  address: merchantAddress,
                  callback: callbackUrl,
            },
      });

      const walletObj = walletResp.data;
      if (!walletObj?.address_in) {
            throw new Error("Could Not Create Onramp Payment Wallet");
      }

      return {
            walletObj,
            paymentLink: `https://checkout.onramp-pay.com/pay.php?address=${walletObj.address_in}&amount=${amount.toFixed(2)}&email=${email}&currency=GBP`,
      };
}

export const processOrder = async (req: NextRequest) => {

      const result = CheckoutSchema.safeParse(await req.json());

      if (!result.success) {
            return NextResponse.json(
                  {
                        status: "failed",
                        message: sendFirstErrorMessage(result),
                  },
                  { status: 400 }
            );
      }

      //guest session
      const authUser = await getAuthFromToken();
      if (!authUser) {
            return NextResponse.json(
                  {
                        status: "AuthFailed",
                        message: "Auth Error",
                  },
                  { status: 401 }
            );
      }

      //authenticated session
      const user = await getUserFromSession();


      const checkoutObj = result.data;

      try {

            const response = await runWithRetry(async (session) => {

                  // capture authoritative product data + stock snapshot for auditing
                  const normalizedCartItems: typeof checkoutObj.cartItems = [];
                  const stockAudit: {
                        productId: string;
                        name: string;
                        stockQty: number;
                        cartQty: number;
                        productType: string;
                  }[] = [];

                  let total = 0;
                  let subTotal = 0;

                  // ---------------- STOCK VALIDATION & TOTALS ----------------
                  for (const item of checkoutObj.cartItems) {

                        const productObj = await fetchProductObj({ _id: item.productObj._id }, session);

                        if (!productObj) {
                              throw new Error(item.productObj.name + " Could Not Be Found");
                        }

                        if (productObj.productType === "Bundles") {
                              total += productObj.variations!.find((v) => v.label! == item?.bundleVariation?.label)!.price;

                              // Count occurrences of each product in the bundle
                              const productCounts = new Map<string, { count: number; value: string }>();
                              for (const _sf of item?.bundleVariation?.selectFields || []) {
                                    const sf = _sf as selectField;
                                    const existing = productCounts.get(sf.productId);
                                    if (existing) {
                                          existing.count++;
                                    } else {
                                          productCounts.set(sf.productId, { count: 1, value: sf.value });
                                    }
                              }

                              // Validate stock for each unique product
                              for (const [productId, { count, value }] of productCounts) {
                                    const _product = await fetchProductObj({ _id: productId }, session);
                                    if (!_product) throw new Error(value + " Could Not Be Found");
                                    if (_product.stockQty < count) {
                                          throw new Error(`${value} - Only ${_product.stockQty} In Stock, Your Requested ${count}`);
                                    }
                              }
                        } else if (productObj.productType === "CheekyDeals") {
                              total += productObj.price * item.cartQty;

                              // Count occurrences of each product across all variations (multiply by cartQty)
                              const productCounts = new Map<string, { count: number; value: string }>();
                              for (const variation of item?.cheekyVariation || []) {
                                    for (const sf of variation.selectFields) {
                                          const existing = productCounts.get(sf.productId);
                                          if (existing) {
                                                existing.count += item.cartQty;
                                          } else {
                                                productCounts.set(sf.productId, { count: item.cartQty, value: sf.value });
                                          }
                                    }
                              }

                              // Validate stock for each unique product
                              for (const [productId, { count, value }] of productCounts) {
                                    const _product = await fetchProductObj({ _id: productId }, session);
                                    if (!_product) throw new Error(`${value} Could Not Be Found`);
                                    if (_product.stockQty < count) {
                                          throw new Error(`${value} - Only ${_product.stockQty} In Stock, Cheeky Deal Requires ${count}`);
                                    }
                              }

                        } else {
                              total += productObj.price * item.cartQty;
                              if (productObj.stockQty < item.cartQty) {
                                    throw new Error(`${productObj.name} - Only ${productObj.stockQty} In Stock, You Ordered ${item.cartQty}`);
                              }
                        }

                        // replace client-sent productObj with fresh server snapshot and log stock at order time
                        normalizedCartItems.push({
                              ...item,
                              productObj: {
                                    ...productObj,
                              }
                        });

                        stockAudit.push({
                              productId: productObj._id,
                              name: productObj.name,
                              stockQty: productObj.stockQty,
                              cartQty: item.cartQty,
                              productType: productObj.productType,
                        });
                  }

                  // ensure downstream logic uses normalized server-side product data
                  checkoutObj.cartItems = normalizedCartItems;

                  subTotal = total;

                  // ---------------- PAYMENT & SHIPPING ----------------
                  const paymentMethod = PAYMENT_METHODS.find((pm) => pm.alias === checkoutObj.paymentGatewayAlias);
                  if (!paymentMethod) throw new Error("The Selected Payment Method Not Available");

                  const deliveryMethod = DELIVERY_METHODS.find((d) => d.alias === checkoutObj.shippingMethodAlias);
                  if (!deliveryMethod) throw new Error("The Selected Delivery Method Not Available");

                  if (deliveryMethod.alias === "24hrs-free-delivery" && subTotal < FREE_DELIVERY_MIN_AMOUNT) {
                        throw new Error(`Free Delivery Is Only Allowed On Order ${CURRENCY_SYMBOL}${FREE_DELIVERY_MIN_AMOUNT} Or Above`);
                  }

                  if (deliveryMethod.alias !== "24hrs-free-delivery") {
                        total += deliveryMethod.fee;
                  }

                  const cleanedPaymentMethod: Record<string, unknown> = { ...paymentMethod };
                  delete cleanedPaymentMethod["tutorialLink"];
                  delete cleanedPaymentMethod["details"];
                  delete cleanedPaymentMethod["image"];

                  // ---------------- COUPONS ----------------

                  //check for duplicate coupon and remove
                  if (checkoutObj.coupons?.length) {
                        checkoutObj.coupons = checkoutObj.coupons.filter(
                              (c, idx, arr) =>
                                    idx === arr.findIndex(
                                          other => other.code.toLowerCase() === c.code.toLowerCase()
                                    )
                        );
                  }

                  if (checkoutObj.coupons.length > 0) {
                        // fetch all coupon objects for the provided codes in one go
                        const codes = checkoutObj.coupons.map(c => c.code);
                        const regexes = codes.map(c => new RegExp(`^${c}$`, "i"));
                        const foundCoupons = await Voucher.find({ code: { $in: regexes } }).session(session).lean<VoucherObj[]>();

                        // map by lowercase code for quick lookup
                        const couponMap = new Map<string, VoucherObj>();
                        for (const c of foundCoupons) {
                              couponMap.set(c.code.toLowerCase(), c);
                        }

                        // ---------------- RULE: single order cannot contain more than 1 referral coupon ----------------
                        const referralCountInOrder = foundCoupons.filter(c => c.voucherType === "referral").length;
                        if (referralCountInOrder > 1) {
                              throw new Error("You Cannot Use More Than 1 Referral Coupon In A Single Order");
                        }

                        // iterate original checkout coupons in order (preserve order and allow missing coupons to be skipped)
                        for (let i = 0; i < checkoutObj.coupons.length; i++) {
                              const coupon = checkoutObj.coupons[i];
                              const couponObj = couponMap.get(coupon.code.toLowerCase());

                              // if coupon not found, skip
                              if (!couponObj) continue;

                              // ---------------- other validatetions ----------------
                              if (couponObj.voucherType === "referral" && subTotal < 50) {
                                    throw new Error("Order Total Cannot Be Less Than £50 To Use Voucher " + couponObj.code);
                              }
                              if (couponObj.usageCount >= couponObj.useageLimit) {
                                    throw new Error("This Voucher Has Reached Its Usage Limit");
                              }
                              if (couponObj.restrictedUsersIds.includes(authUser._gid)) {
                                    throw new Error("Oops: You Are Not Allowed To Use This Voucher");
                              }
                              const timesUsed = couponObj.usageUserIds.filter((u) => u === authUser._gid);
                              if (timesUsed.length >= couponObj.usageLimitPerUser) {
                                    throw new Error("Oops: You Have Reached The Usage Limit For This Voucher");
                              }

                              // ---------------- NEW REFERRAL RULES ----------------
                              if (couponObj.voucherType === "referral") {
                                    // 1) Only authenticated users can apply referral coupons
                                    if (!user) {
                                          throw new Error("You Must Be A Registered User To Use A Referral Coupon");
                                    }

                                    // 2) A user (or guest) cannot have used a referral coupon before.
                                    //    Search orders by _gid OR by billing email (both guest and logged-in orders can be matched).
                                    // check if user has used referral coupon before
                                    const previousReferralOrder = await Order.findOne({
                                          $and: [
                                                { $or: [{ _gid: authUser._gid }, { "billingObj.email": checkoutObj.billingObj.email }] },
                                                { "coupons.voucherType": "referral" },
                                                { status: { $ne: "cancelled" } }, // ignore cancelled orders only
                                          ],
                                    })
                                          .session(session)
                                          .lean<OrderObj>();

                                    if (previousReferralOrder) {
                                          // If the previous order is still pending
                                          if (previousReferralOrder.status === "pending") {
                                                throw new Error(
                                                      `You Already Have A Pending Order (${previousReferralOrder.orderId}) That Used This Referral Coupon. Please Contact Support To Cancel It Before Reusing It`
                                                );
                                          }

                                          // If it's completed or any other non-cancelled status
                                          if (previousReferralOrder.status === "completed" || previousReferralOrder.status === "on-hold") {
                                                throw new Error("You Have Already Used A Referral Coupon Before");
                                          }
                                    }

                                    // (Note: we already enforced subTotal >= 50 above for referral)
                              }

                              // ---------------- APPLY COUPON (updates + discount) ----------------
                              await Voucher.updateOne(
                                    { _id: couponObj._id },
                                    {
                                          $inc: { usageCount: 1 },
                                          $push: { usageUserIds: authUser._gid },
                                    },
                                    { session }
                              );

                              if (couponObj.discountType === "fixedAmount") {
                                    total -= couponObj.cartDiscount;
                              } else if (couponObj.discountType === "discount") {
                                    total -= total * (couponObj.cartDiscount / 100);
                              }

                              // replace the coupon entry with the full coupon object for later use
                              checkoutObj.coupons[i] = couponObj;
                        }
                  }

                  // ---------------- USE BALANCE ----------------
                  const useBalance = parseFloat(checkoutObj.useBalance);
                  if (useBalance > 0) {
                        const user = await getUserFromSession();
                        if (user) {
                              if (parseFloat(user.balance) >= useBalance) {
                                    const newBalance = parseFloat(user.balance) - useBalance;
                                    await User.updateOne({ _id: user._id }, { balance: newBalance }, { session });
                                    total -= useBalance;
                              } else {
                                    throw new Error("You Cheeky Cow 🤨 The Amount You Entered Is Higher Than Your Available Balance");
                              }
                        }
                  }

                  total = total < 0 ? 0 : total;

                  const gatewayFee = paymentMethod.alias.toLowerCase() === "onramp" && total > 0
                        ? Number((total * 0.10).toFixed(2))
                        : 0;

                  const onrampPaymentTotal = Number((total + gatewayFee).toFixed(2));

                  // ---------------- CREATE ORDER ----------------
                  const counter = await Counter.findOneAndUpdate(
                        { _id: "orderId" },
                        { $inc: { seq: 1 } },
                        { new: true, upsert: true }
                  ).session(session);

                  const orderId = "HR-" + counter.seq;

                  const _order = {
                        orderId,
                        _gid: authUser._gid,
                        cartItems: checkoutObj.cartItems,
                        billingObj: checkoutObj.billingObj,
                        paymentGateway: cleanedPaymentMethod,
                        shippingMethod: deliveryMethod,
                        status: total === 0 ? "on-hold" : "pending",
                        useBalance: checkoutObj.useBalance,
                        coupons: checkoutObj.coupons,
                        amountSubTotal: subTotal,
                        amountTotal: total,
                        orderFilled: total === 0 ? new Date() : undefined,
                  }

                  const orderCreated = await Order.create(
                        [
                              _order,
                        ],
                        { session }
                  );

                  if (!orderCreated) throw new Error("Error: Could Not Create Order Right Now");

                  console.log("Stock snapshot captured at order creation", { orderId, items: stockAudit });

                  const res = {
                        status: "success",
                        message: "Order Created",
                        paymentStatus: "completed",
                        paymentId: "",
                        orderId,
                  };

                  if (total > 0) {
                        if (paymentMethod.alias.toLowerCase() === "onramp") {
                              const onrampPayment = await createOnrampPaymentLink({
                                    amount: onrampPaymentTotal,
                                    email: checkoutObj.billingObj.email,
                                    orderId,
                                    origin: req.nextUrl.origin,
                              });

                              const txObjArr: ITransaction[] = await Transaction.create(
                                    [
                                          {
                                                _gid: authUser._gid,
                                                refrenceId: orderId,
                                                amount: total,
                                                gatewayFee,
                                                paymentGateway: paymentMethod,
                                                status: "pending",
                                                paymentLink: onrampPayment.paymentLink,
                                                provider: "hosted",
                                                address: onrampPayment.walletObj.polygon_address_in || onrampPayment.walletObj.address_in,
                                                addressIn: onrampPayment.walletObj.address_in,
                                                coin: "USDC",
                                                network: "POLYGON",
                                                webhookData: {
                                                      callbackUrl: onrampPayment.walletObj.callback_url,
                                                      ipnToken: onrampPayment.walletObj.ipn_token,
                                                },
                                          },
                                    ],
                                    { session }
                              );

                              res.paymentStatus = "pending";
                              res.paymentId = txObjArr[0]._id.toString();

                              return NextResponse.json(res);
                        }

                        const postObj: any = {
                              amount: total,
                              deposit_id: orderId,
                              coin: "BCH",
                              network: "BITCOIN",
                              woo_order_url: APP_URL + "/api/webhook96_14_v1/?orderid=" + orderId,
                        };

                        if (paymentMethod.alias.toLowerCase() === "wert") {
                              postObj.coin = "USDT";
                              postObj.network = "POLYGON";
                        }

                        const reqGateway = await axios.post(GATEWAY_ENDPOINT + "/create", postObj, {
                              headers: {
                                    Authorization: `Bearer ${process.env.HR_BCH_GATEWAY_TOKEN}`,
                              },
                        });

                        const resp = reqGateway.data;
                        if (resp.status === "success") {
                              const txObjArr: ITransaction[] = await Transaction.create(
                                    [
                                          {
                                                _gid: authUser._gid,
                                                refrenceId: orderId,
                                                amount: total,
                                                paymentGateway: paymentMethod,
                                                status: "pending",
                                                amountCrypto: resp.depositObj.amount,
                                                address: resp.depositObj.address,
                                                coin: resp.depositObj.coin,
                                                network: resp.depositObj.network,
                                                amountEur: await convertGBPtoEUR(total),
                                          },
                                    ],
                                    { session }
                              );

                              res.paymentStatus = "pending";
                              res.paymentId = txObjArr[0]._id.toString();
                        } else {
                              throw new Error("Could Not Create Payment: Try Again");
                        }
                  } else {
                        const _order: OrderObj = orderCreated[0].toObject();
                        await reduceOrderItemsStock(_order);
                        const emailConfig = TEMPLATE_MAP["on-hold"];
                        if (emailConfig) {
                              await sendEmail({
                                    to: _order.billingObj.email,
                                    from: "order",
                                    subject: emailConfig.subject,
                                    template: emailConfig.template,
                                    data: { checkoutObj: _order },
                              });
                        }
                  }

                  return NextResponse.json(res);
            });

            return response;

      } catch (error: any) {

            console.error(error.message ?? error);

            const message = error?.message?.includes("Unable to write")
                  ? "Error Creating Order: Kindly Try Again"
                  : error?.message || "Unknown error";

            return NextResponse.json({ status: "failed", message });
      }
};
