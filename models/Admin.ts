import { model, models, Schema } from "mongoose";
import connectDBIfNoConnExist from '../libs/mongoose'
import { IAdmin } from "@/Interface";

await connectDBIfNoConnExist();

const adminSchema = new Schema<IAdmin>({
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
      accessLevel: {
            type: String,
            enum: ['A', 'B', 'C'],
            default: 'A',
            required: true
      },
      status: {
            type: String,
            enum: ['active', 'disabled', 'unverified'],
            default: 'unverified',
            required: true
      },
      token: {
            type: String
      },
      verificationCode: {
            type: String
      },
      verificationCodeExpiresAt: {
            type: Date
      },
      shortLived: {
            type: Boolean
      },
}, { timestamps: true });


// adminSchema.pre('find', function () {
//       this.sort({ id: -1 });
// });


export default models.Admin || model<IAdmin>('Admin', adminSchema);
