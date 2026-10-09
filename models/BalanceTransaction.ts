import { model, models, Schema } from 'mongoose';
import connectDBIfNoConnExist from '@/libs/mongoose';

await connectDBIfNoConnExist();

const schema = new Schema({
      userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
      _gid: { type: String, required: true, index: true },
      email: { type: String, required: true, index: true },
      username: String,
      amount: { type: Number, required: true },
      balanceAfter: { type: Number, required: true },
      reason: { type: String, enum: ['Order', 'Referral', 'Refund', 'Out of Stock', 'Underpayment'], required: true, index: true },
      counterparty: { type: String, required: true },
      orderId: String,
      adminId: String,
      eventKey: { type: String, unique: true, required: true },
      pendingAccount: { type: Boolean, default: false },
}, { timestamps: true });
schema.index({ userId: 1, createdAt: -1 });
schema.index({ reason: 1, createdAt: -1 });

export default models.BalanceTransaction || model('BalanceTransaction', schema, 'balance_transaction');
