import { ITransaction } from "@/Interface";
import connectDBIfNoConnExist from '../libs/mongoose'
import { model, models, Schema } from "mongoose";

await connectDBIfNoConnExist();

const TransactionSchema = new Schema<ITransaction>(
      {
            _gid: {
                  type: String
            },
            refrenceId: {
                  type: String,
                  required: true,
            },
            amount: {
                  type: String,
            },
            gatewayFee: {
                  type: String,
            },
            amountUsd: {
                  type: String,
            },
            amountEur: {
                  type: String,
            },
            paymentGateway: {
                  type: Object,
            },
            address: {
                  type: String
            },
            amountCrypto: {
                  type: String
            },
            coin: {
                  type: String
            },
            network: {
                  type: String
            },
            paymentLink: {
                  type: String
            },
            provider: {
                  type: String
            },
            addressIn: {
                  type: String
            },
            txidIn: {
                  type: String
            },
            txidOut: {
                  type: String
            },
            valueCoin: {
                  type: String
            },
            valueForwardedCoin: {
                  type: String
            },
            amountPaidUsd: {
                  type: String
            },
            amountRequiredUsd: {
                  type: String
            },
            balanceCredited: {
                  type: String
            },
            webhookData: {
                  type: Object
            },
            status: {
                  type: String,
                  enum: ["completed", "pending", "cancelled"],
                  required: true,
                  default: "active"
            },
      }, { timestamps: true }
);


export default models.Transaction || model('Transaction', TransactionSchema);
