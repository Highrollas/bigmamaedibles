import { getAdminFromSession } from '@/app/Helper/server';
import BalanceTransaction from '@/models/BalanceTransaction';
import { migrateBalanceHistory } from '@/libs/balance';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
      const admin = await getAdminFromSession();
      if (!admin) return NextResponse.json({ status: 'failed', message: 'Unauthorized' }, { status: 401 });
      if (admin.accessLevel !== 'AA') return NextResponse.json({ status: 'failed', message: 'AA Access Required' }, { status: 403 });
      try {
            const params = request.nextUrl.searchParams;
            const page = Number(params.get('page') || 1);
            const reason = params.get('reason') || '';
            const direction = params.get('direction') || '';
            if (!Number.isSafeInteger(page) || page < 1 || page > 100000 || (reason && !['Referral', 'Out of Stock', 'Refund', 'Order', 'Underpayment'].includes(reason)) || (direction && !['credit', 'debit'].includes(direction))) {
                  return NextResponse.json({ status: 'failed', message: 'Invalid Filter' }, { status: 400 });
            }
            const dates: Record<string, Date> = {};
            for (const key of ['dateStart', 'dateEnd']) {
                  const value = params.get(key);
                  if (!value) continue;
                  const date = new Date(`${value}T00:00:00.000Z`);
                  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
                        return NextResponse.json({ status: 'failed', message: 'Invalid Date' }, { status: 400 });
                  }
                  dates[key] = date;
            }
            if (dates.dateStart && dates.dateEnd && dates.dateStart > dates.dateEnd) return NextResponse.json({ status: 'failed', message: 'Start Date Must Precede End Date' }, { status: 400 });
            const dateFilter = { ...(dates.dateStart ? { $gte: dates.dateStart } : {}), ...(dates.dateEnd ? { $lt: new Date(dates.dateEnd.getTime() + 86400000) } : {}) };
            const periodFilter = Object.keys(dateFilter).length ? { createdAt: dateFilter } : {};
            const filter = { ...periodFilter, ...(reason ? { reason: reason === 'Refund' ? { $in: ['Refund', 'Underpayment'] } : reason } : {}), ...(direction ? { amount: direction === 'credit' ? { $gt: 0 } : { $lt: 0 } } : {}) };

            await migrateBalanceHistory();
            const summary = await BalanceTransaction.aggregate([
                  { $match: periodFilter },
                  { $group: {
                        _id: { $cond: [{ $eq: ['$reason', 'Underpayment'] }, 'Refund', '$reason'] },
                        credits: { $sum: { $cond: [{ $gt: ['$amount', 0] }, '$amount', 0] } },
                        debits: { $sum: { $cond: [{ $lt: ['$amount', 0] }, { $multiply: ['$amount', -1] }, 0] } },
                        net: { $sum: '$amount' }, count: { $sum: 1 },
                  } }, { $sort: { _id: 1 } },
            ]);
            const transactions = await BalanceTransaction.find(filter).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * 25).limit(25).lean();
            const total = await BalanceTransaction.countDocuments(filter);
            return NextResponse.json({ status: 'success', summary, transactions, total }, { headers: { 'Cache-Control': 'no-store' } });
      } catch (error) {
            console.error('Error loading admin balances:', error);
            return NextResponse.json({ status: 'failed', message: 'Unable To Load Balances' }, { status: 500 });
      }
}
