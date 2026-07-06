import { ICheckout } from "@/Interface";
import connectDBIfNoConnExist from '../libs/mongoose'
import { model, models, Schema } from "mongoose";

await connectDBIfNoConnExist();

const OrderSchema = new Schema<ICheckout>(
      {
            _gid: {
                  type: String
            },
            orderId: {
                  type: String,
                  unique: true,
                  required: true
            },
            cartItems: {
                  type: [Object],
                  required: true,
            },
            billingObj: {
                  type: Object,
            },
            paymentGateway: {
                  type: Object,
            },
            shippingMethod: {
                  type: Object,
            },
            coupons: {
                  type: [Object]
            },
            useBalance: {
                  type: String
            },
            amountSubTotal: {
                  type: String
            },
            amountTotal: {
                  type: String
            },
            status: {
                  type: String,
                  enum: ["completed", "pending", "on-hold", "processing", "cancelled", "trashed"],
                  default: "pending"
            },
            refSource: {
                  type: String
            },
            isPatched: {
                  type: Boolean
            },
            orderFilled: {
                  type: Date,
                  default: null,
            },

            createdAt: { type: Date, default: Date.now, immutable: false },
            updatedAt: { type: Date, default: Date.now }

      }, { timestamps: false }
);


export default models.Order || model('Order', OrderSchema);