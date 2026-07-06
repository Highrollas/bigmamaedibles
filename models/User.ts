import { model, models, Schema } from "mongoose";
import connectDBIfNoConnExist from '../libs/mongoose'
import { IUser } from "@/Interface";

await connectDBIfNoConnExist();

const userSchema = new Schema<IUser>({
      _gid: {
            type: String,
      },
      username: {
            type: String,
            unique: true
      },
      firstName: {
            type: String,
            required: true
      },
      lastName: {
            type: String,
            required: true
      },
      email: {
            type: String,
            required: true,
            unique: true
      },
      password: {
            type: String,
            required: true,
            unique: true
      },
      status: {
            type: String,
            enum: ['active', 'disabled', 'unverified'],
            default: 'unverified',
            required: true
      },
      balance: {
            type: String,
            default: "0",
      },
      token: {
            type: String
      },
      referralCoupon: {
            type: String
      },
      referralCouponUsed: {
            type: Boolean
      },
      verificationCode: {
            type: String
      },
      avatar: {
            type: String
      },
      coupon: {
            type: String
      },
      billingObj: {
            type: [Object]
      }
}, { timestamps: true });


// userSchema.pre('find', function () {
//       this.sort({ id: -1 });
// });


export default models.User || model<IUser>('User', userSchema);
