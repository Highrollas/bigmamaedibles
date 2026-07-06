import { IVoucher } from '@/Interface';
import { Schema, model, models } from 'mongoose';
import connectDBIfNoConnExist from '../libs/mongoose'

await connectDBIfNoConnExist();

const voucherSchema = new Schema<IVoucher>(
      {
            code: {
                  type: String,
                  required: true,
                  unique: true,
                  trim: true,
            },
            usageUserIds: {
                  type: [String],
                  default: []
            },
            usageCount: {
                  type: Number,
                  default: 0,
            },
            useageLimit: {
                  type: Number,
                  default: 10000,
            },
            usageLimitPerUser: {
                  type: Number,
                  default: 1
            },
            restrictedUsersIds: {
                  type: [String],
                  default: []
            },
            status: {
                  type: String,
                  enum: ["active", "inactive"],
                  required: true,
                  default: "active"
            },
            cartDiscount: {
                  type: Number,
                  required: true,
                  default: 1,
            },
            discountType: {
                  type: String,
                  enum: ["fixedAmount", "discount"],
                  required: true
            },
            voucherType: {
                  type: String,
                  enum: ["referral", "voucher"],
                  required: true,
                  default: "voucher"
            },
            userId: {
                  type: String
            },
      },
      { timestamps: true }
);

export default models.Voucher || model<IVoucher>('Voucher', voucherSchema);
