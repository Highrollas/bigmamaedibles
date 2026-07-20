/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendFirstErrorMessage } from "@/app/Helper";
import { getAuthFromToken } from "@/app/Helper/server";
import { GATEWAY_ENDPOINT } from "@/constants";
import { ITransaction, OrderObj, TransactionObj, UserObj } from "@/Interface";
import Order from "@/models/Order";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import { TransactionStatusSchema } from "@/schema";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { setOrderStatus } from "./Order";

export const checkTransactionStatus = async (req: NextRequest) => {

      try {

            const { searchParams } = new URL(req.url);

            const _transactionId = searchParams.get("transactionId");

            const result = TransactionStatusSchema.safeParse({ transactionId: _transactionId });

            if (!result.success) {
                  return NextResponse.json({
                        status: "failed", message: sendFirstErrorMessage(result)
                  }, { status: 400 });
            }

            //from token because user might be a guest
            const authUser = await getAuthFromToken();
            if (!authUser) {
                  return NextResponse.json({
                        status: "AuthFailed", message: "Auth Error"
                  }, { status: 401 });
            }

            const { transactionId } = result.data;

            const txObj = await Transaction.findOne({ _id: transactionId }).lean<TransactionObj>();

            if (txObj) {

                  return NextResponse.json({
                        status: "success",
                        transactionObj: {
                              paymentStatus: txObj.status,
                              transactionId,
                              orderId: txObj.refrenceId,
                              amount: txObj.amount,
                              gatewayFee: txObj.gatewayFee,
                              amountPaidUsd: txObj.amountPaidUsd,
                              amountRequiredUsd: txObj.amountRequiredUsd,
                              balanceCredited: txObj.balanceCredited,
                              amountCrypto: txObj.amountCrypto,
                              address: txObj.address,
                              paymentLink: txObj.paymentLink,
                              provider: txObj.provider,
                              // amountUsd: txObj.amountUsd,
                              amountEur: txObj.amountEur,
                              createdAt: txObj.createdAt
                        }
                  });

            } else {

                  return NextResponse.json({
                        status: "failed", message: "Could not find transaction"
                  }, { status: 400 });

            }

      } catch (error) {

            console.error("error @checkTransactionStatus", error);

            return NextResponse.json({
                  status: "failed", message: "Could not find transaction"
            }, { status: 400 });

      }
}

async function checkDepositStatus(orderId: string, attempts = 4): Promise<any | null> {

      const postObj = { deposit_id: orderId };

      for (let i = 0; i < attempts; i++) {

            try {

                  const res = await axios.post(
                        `${GATEWAY_ENDPOINT}/status`,
                        postObj,
                        {
                              headers: {
                                    Authorization: `Bearer ${process.env.HR_BCH_GATEWAY_TOKEN}`,
                              },
                        }
                  );

                  const resp = res.data;

                  if (resp?.status === "success" && resp?.depositObj?.status === "success") {
                        return resp;
                  }

                  console.warn(`Attempt ${i + 1} returned non-success status for order status check ${orderId}`, resp);

                  // wait 1s before retry
                  await new Promise((resolve) => setTimeout(resolve, 1000));

            } catch (err) {
                  console.warn(`Attempt ${i + 1} failed for order status check ${orderId}`, err);
                  await new Promise((resolve) => setTimeout(resolve, 2000));
            }
      }

      return null;
}

async function convertOnrampToUsd(from: string, value: string) {
      const res = await axios.get("https://api.onramp-pay.com/control/convert.php", {
            params: { from, value },
      });

      const data = res.data;
      const valueUsd = parseFloat(String(data?.value_coin || ""));
      const exchangeRate = parseFloat(String(data?.exchange_rate || ""));

      if (data?.status !== "success" || Number.isNaN(valueUsd) || Number.isNaN(exchangeRate) || exchangeRate <= 0) {
            throw new Error("Could Not Convert Onramp Payment Amount");
      }

      return { valueUsd, exchangeRate };
}

async function creditUnderpaymentToBalance(order: OrderObj, paidUsd: number, gbpUsdRate: number) {
      const paidGbp = Number((paidUsd / gbpUsdRate).toFixed(2));
      if (paidGbp <= 0) return "0.00";

      const user = await User.findOne({ _gid: order._gid }).lean<UserObj>();
      if (!user) return "0.00";

      const newBalance = Number(((parseFloat(user.balance) || 0) + paidGbp).toFixed(2));
      await User.updateOne({ _gid: order._gid }, { balance: newBalance.toString() });

      return paidGbp.toFixed(2);
}

export const handleWebhook = async (req: NextRequest) => {
      try {

            const { searchParams } = new URL(req.url);
            const orderId = searchParams.get("orderid");
            const isPatched = searchParams.get("ispatched");

            if (!orderId || orderId === "") {
                  return NextResponse.json({ message: "received" });
            }

            const txObj = await Transaction.findOne<ITransaction>({ refrenceId: orderId });

            if (txObj && txObj.status === "pending") {

                  const depositConfirmed = await checkDepositStatus(orderId);

                  if (depositConfirmed) {
                        await setOrderStatus({ status: "on-hold", orderId, isPatched: isPatched ? true : false });
                        await Transaction.updateOne({ refrenceId: orderId }, { status: "completed" });
                  }
            }

            return NextResponse.json({ message: "received" });

      } catch (error) {
            console.warn("webhook error", error);
      }
};

export const handleOnrampWebhook = async (req: NextRequest, invoiceId: string) => {

      try {
            const { searchParams } = new URL(req.url);
            const pending = searchParams.get("pending");
            const txidOut = searchParams.get("txid_out");

            if (!invoiceId) {
                  return NextResponse.json({ message: "received" });
            }

            const webhookData = {
                  coin: searchParams.get("coin"),
                  valueCoin: searchParams.get("value_coin"),
                  txidIn: searchParams.get("txid_in"),
                  txidOut,
                  uuid: searchParams.get("uuid"),
                  addressIn: searchParams.get("address_in"),
                  valueForwardedCoin: searchParams.get("value_forwarded_coin"),
                  pending,
            };

            await Transaction.updateOne(
                  { refrenceId: invoiceId },
                  {
                        $set: {
                              coin: webhookData.coin || undefined,
                              addressIn: webhookData.addressIn || undefined,
                              txidIn: webhookData.txidIn || undefined,
                              txidOut: webhookData.txidOut || undefined,
                              valueCoin: webhookData.valueCoin || undefined,
                              valueForwardedCoin: webhookData.valueForwardedCoin || undefined,
                              webhookData,
                        },
                  }
            );

            if (pending == "0" && txidOut) {
                  const txObj = await Transaction.findOne<ITransaction>({ refrenceId: invoiceId });
                  const order = await Order.findOne({ orderId: invoiceId }).lean<OrderObj>();

                  if (txObj && txObj.status === "pending" && order) {
                        if (!webhookData.coin || !webhookData.valueForwardedCoin) {
                              throw new Error("Onramp Webhook Missing Conversion Fields");
                        }

                        const paidConversion = await convertOnrampToUsd(webhookData.coin, webhookData.valueForwardedCoin);
                        const requiredConversion = await convertOnrampToUsd("gbp", String(order.amountTotal));
                        const paidUsd = paidConversion.valueUsd;
                        const requiredUsd = requiredConversion.valueUsd;

                        const underpaymentToleranceUsd = 1.50;

                        if (paidUsd + underpaymentToleranceUsd >= requiredUsd) {
                              await setOrderStatus({ status: "on-hold", orderId: invoiceId });
                              await Transaction.updateOne(
                                    { refrenceId: invoiceId },
                                    {
                                          status: "completed",
                                          amountPaidUsd: paidUsd.toFixed(2),
                                          amountRequiredUsd: requiredUsd.toFixed(2),
                                    }
                              );
                        } else {

                              console.log(`Underpayment detected for order ${invoiceId}: Paid USD ${paidUsd.toFixed(2)}, Required USD ${requiredUsd.toFixed(2)}`);

                              // const balanceCredited = await creditUnderpaymentToBalance(order, paidUsd, requiredConversion.exchangeRate);

                              // await setOrderStatus({ status: "cancelled", orderId: invoiceId });
                              // await Transaction.updateOne(
                              //       { refrenceId: invoiceId },
                              //       {
                              //             status: "cancelled",
                              //             amountPaidUsd: paidUsd.toFixed(2),
                              //             amountRequiredUsd: requiredUsd.toFixed(2),
                              //             balanceCredited,
                              //             webhookData: {
                              //                   ...webhookData,
                              //                   underpaid: true,
                              //                   paidUsd: paidUsd.toFixed(2),
                              //                   requiredUsd: requiredUsd.toFixed(2),
                              //                   balanceCredited,
                              //             },
                              //       }
                              // );
                        }
                  } else {
                        console.warn(`Transaction or Order not found for invoiceId ${invoiceId} during Onramp webhook processing.`);
                  }
            } else {
                  console.log(`Onramp webhook received for invoiceId ${invoiceId} with pending status: ${pending} and txidOut: ${txidOut}`);
            }

            return NextResponse.json({ message: "received" });

      } catch (error) {
            console.warn("onramp webhook error", error);
            return NextResponse.json({ message: "received" });
      }
};
