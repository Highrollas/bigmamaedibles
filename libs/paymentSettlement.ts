import mongoose, { ClientSession } from 'mongoose';
import Order from '@/models/Order';
import Products from '@/models/Products';
import User from '@/models/User';
import { OrderObj } from '@/Interface';
import { payOrderCommission, rollbackOrderUsedParams } from '@/app/Helper/server';
import { changeBalance } from '@/libs/balance';
import { getStockRequirements } from '@/libs/orderStock';
import { sendEmail } from '@/libs/emailService';
import { TEMPLATE_MAP } from '@/constants';

export const STOCK_CANCELLATION_REASON = 'out-of-stock-during-payment';

export async function checkAndDeductStock(order: OrderObj, session: ClientSession) {
      const requirements = getStockRequirements(order.cartItems);
      for (const [productId, quantity] of requirements) {
            const product = await Products.findById(productId).session(session);
            if (!product || product.stockQty < quantity) return false;
      }
      for (const [productId, quantity] of requirements) {
            const result = await Products.updateOne({ _id: productId, stockQty: { $gte: quantity } }, { $inc: { stockQty: -quantity } }, { session });
            if (result.modifiedCount !== 1) throw new Error('Stock Changed During Payment Confirmation');
      }
      return true;
}

export async function notifyPaymentOutcome(order: OrderObj) {
      if (order.status !== 'on-hold' && order.cancelReason !== STOCK_CANCELLATION_REASON) return;
      const claimed = await Order.findOneAndUpdate({
            orderId: order.orderId,
            paymentEmailSentAt: null,
            $or: [{ paymentEmailSendingAt: null }, { paymentEmailSendingAt: { $lt: new Date(Date.now() - 5 * 60 * 1000) } }],
      }, { $set: { paymentEmailSendingAt: new Date() } }).lean<OrderObj>();
      if (!claimed) return;
      try {
            const cancelled = order.cancelReason === STOCK_CANCELLATION_REASON;
            const config = TEMPLATE_MAP['on-hold'];
            const sent = await sendEmail({
                  to: order.billingObj.email, from: 'order',
                  subject: cancelled ? `Order ${order.orderId} Cancelled - Balance Credited` : config.subject,
                  template: cancelled ? 'order-out-of-stock' : config.template,
                  data: { checkoutObj: order, creditedAmount: order.balanceCredited, pendingAccount: !await User.exists({ _gid: order._gid }) },
            });
            if (sent) await Order.updateOne({ orderId: order.orderId }, { $set: { paymentEmailSentAt: new Date() }, $unset: { paymentEmailSendingAt: 1 } });
            else await Order.updateOne({ orderId: order.orderId }, { $unset: { paymentEmailSendingAt: 1 } });
      } catch (error) {
            await Order.updateOne({ orderId: order.orderId }, { $unset: { paymentEmailSendingAt: 1 } });
            console.error('Payment outcome email failed:', error);
      }
}

export async function settlePaidOrder(orderId: string, isPatched = false) {
      const session = await mongoose.startSession();
      try {
            const order = await session.withTransaction(async () => {
                  const existing = await Order.findOne({ orderId }).session(session).lean<OrderObj>();
                  if (!existing) throw new Error('Order Not Found');
                  if (existing.paymentReceivedAt) return existing;
                  if (!['pending', 'cancelled'].includes(existing.status)) return existing;
                  // Older unpaid cancellations restored balance before rollback markers existed.
                  const rolledBack = existing.checkoutRolledBack || existing.status === 'cancelled';
                  const inStock = await checkAndDeductStock(existing, session);
                  const now = new Date();
                  const update: Record<string, unknown> = { paymentReceivedAt: now, orderFilled: now, updatedAt: now };
                  if (isPatched) update.isPatched = true;

                  if (!inStock) {
                        const paidAmount = Number(existing.amountTotal || 0);
                        await changeBalance({ _gid: existing._gid, email: existing.billingObj.email, amount: paidAmount,
                              reason: 'Out of Stock', counterparty: 'BM', orderId,
                              eventKey: `stock-refund:${orderId}`, allowPendingAccount: true, session });
                        await rollbackOrderUsedParams({ ...existing, checkoutRolledBack: rolledBack }, session, 'Out of Stock');
                        update.status = 'cancelled';
                        update.cancelReason = STOCK_CANCELLATION_REASON;
                        update.balanceCredited = (paidAmount + Number(existing.useBalance || 0)).toFixed(2);
                  } else {
                        // Late payment may arrive after an unpaid order was already rolled back.
                        if (rolledBack) {
                              const used = Number(existing.useBalance || 0);
                              if (used > 0) await changeBalance({ _gid: existing._gid, amount: -used, reason: 'Order', counterparty: orderId, orderId, eventKey: `late-payment-balance:${orderId}`, session });
                        }
                        update.status = 'on-hold';
                        update.cancelReason = null;
                        await payOrderCommission(existing, session);
                  }
                  return (await Order.findOneAndUpdate({ orderId }, { $set: update }, { new: true, session }).lean<OrderObj>())!;
            });
            if (!order) throw new Error('Payment Settlement Failed');
            await notifyPaymentOutcome(order);
            return { success: true as const, order };
      } finally {
            await session.endSession();
      }
}
