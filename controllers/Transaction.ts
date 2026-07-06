/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendFirstErrorMessage } from "@/app/Helper";
import { getAuthFromToken } from "@/app/Helper/server";
import { GATEWAY_ENDPOINT } from "@/constants";
import { ITransaction, TransactionObj } from "@/Interface";
import Transaction from "@/models/Transaction";
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
                              amountCrypto: txObj.amountCrypto,
                              address: txObj.address,
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
