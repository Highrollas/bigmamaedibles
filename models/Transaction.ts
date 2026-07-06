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
            status: {
                  type: String,
                  enum: ["completed", "pending", "cancelled"],
                  required: true,
                  default: "active"
            },
      }, { timestamps: true }
);


export default models.Transaction || model('Transaction', TransactionSchema);