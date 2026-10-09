import mongoose, { ClientSession } from 'mongoose';
import User from '@/models/User';
import BalanceTransaction from '@/models/BalanceTransaction';
import { UserObj } from '@/Interface';

export type BalanceReason = 'Order' | 'Referral' | 'Refund' | 'Out of Stock' | 'Underpayment';

interface BalanceChange {
      userId?: string;
      _gid?: string;
      email?: string;
      amount?: number;
      targetBalance?: number;
      reason: BalanceReason;
      counterparty: string;
      orderId?: string;
      adminId?: string;
      eventKey: string;
      allowPendingAccount?: boolean;
      session?: ClientSession;
}

export async function changeBalance(change: BalanceChange): Promise<number> {
      if (!change.session) {
            const session = await mongoose.startSession();
            try {
                  return (await session.withTransaction(() => changeBalance({ ...change, session })))!;
            } finally {
                  await session.endSession();
            }
      }
      const { session } = change;
      const previous = await BalanceTransaction.findOne({ eventKey: change.eventKey }).session(session);
      if (previous) return previous.amount;

      const filter = change.userId ? { _id: change.userId } : { _gid: change._gid };
      const user = await User.findOne(filter).session(session).lean<UserObj>();
      if (!user && !change.allowPendingAccount) throw new Error('Account Not Found For Balance Change');

      let current = user ? Number(user.balance || 0) : 0;
      if (!user) {
            const [pending] = await BalanceTransaction.aggregate([
                  { $match: { _gid: change._gid, pendingAccount: true } },
                  { $group: { _id: null, amount: { $sum: '$amount' } } },
            ]).session(session);
            current = pending?.amount || 0;
      }
      const amount = Number((change.targetBalance !== undefined ? change.targetBalance - current : change.amount || 0).toFixed(2));
      const balanceAfter = Number((current + amount).toFixed(2));
      if (!Number.isFinite(amount) || !Number.isFinite(balanceAfter)) throw new Error('Invalid Balance Amount');
      if (amount === 0) return 0;
      if (balanceAfter < 0 && change.reason !== 'Referral') throw new Error('Insufficient Account Balance');

      if (user) await User.updateOne({ _id: user._id }, { $set: { balance: balanceAfter.toFixed(2) } }, { session });
      await BalanceTransaction.create([{
            userId: user?._id,
            _gid: user?._gid || change._gid,
            email: user?.email || change.email,
            username: user?.username,
            amount, balanceAfter,
            reason: change.reason,
            counterparty: change.counterparty,
            orderId: change.orderId,
            adminId: change.adminId,
            eventKey: change.eventKey,
            pendingAccount: !user,
      }], { session });
      return amount;
}

// Preserve already-recorded history without applying its balance changes again.
export async function migrateBalanceHistory(userId?: string) {
      const users = User.find({ ...(userId ? { _id: userId } : { 'balanceHistory.0': { $exists: true } }), balanceHistoryMigrated: { $ne: true } })
            .select('+balanceHistory').lean<UserObj>().cursor();
      for await (const user of users) {
            const operations = (user.balanceHistory || []).map(entry => ({ updateOne: {
                  filter: { eventKey: `legacy:${entry._id}` },
                  update: { $setOnInsert: {
                        _id: new mongoose.Types.ObjectId(String(entry._id)),
                        userId: user._id, _gid: user._gid, email: user.email, username: user.username,
                        amount: entry.amount, balanceAfter: entry.balanceAfter,
                        reason: entry.reason === 'Adjustment' ? 'Refund' : entry.reason,
                        counterparty: entry.counterparty, orderId: entry.orderId,
                        eventKey: `legacy:${entry._id}`, createdAt: new Date(entry.createdAt), updatedAt: new Date(entry.createdAt),
                  } }, upsert: true,
            } }));
            if (operations.length) await BalanceTransaction.bulkWrite(operations, { timestamps: false });
            await User.updateOne({ _id: user._id }, { $set: { balanceHistoryMigrated: true } });
      }
}

export async function claimPendingBalance(userId: string) {
      const session = await mongoose.startSession();
      try {
            await session.withTransaction(async () => {
                  const user = await User.findById(userId).session(session).lean<UserObj>();
                  if (!user) return;
                  const entries = await BalanceTransaction.find({ email: user.email, pendingAccount: true }).sort({ createdAt: 1 }).session(session);
                  let balance = Number(user.balance || 0);
                  for (const entry of entries) {
                        balance = Number((balance + entry.amount).toFixed(2));
                        await BalanceTransaction.updateOne({ _id: entry._id }, { $set: { userId: user._id, _gid: user._gid, username: user.username, pendingAccount: false, balanceAfter: balance } }, { session });
                  }
                  if (entries.length) await User.updateOne({ _id: user._id }, { $set: { balance: balance.toFixed(2) } }, { session });
            });
      } finally {
            await session.endSession();
      }
}
