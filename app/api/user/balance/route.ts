import { getUserFromSession } from '@/app/Helper/server';
import BalanceTransaction from '@/models/BalanceTransaction';
import { migrateBalanceHistory } from '@/libs/balance';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
      try {
            const user = await getUserFromSession();
            if (!user) return NextResponse.json({ status: 'failed', message: 'Please Log In Again' }, { status: 401 });

            const type = request.nextUrl.searchParams.get('type') || 'received';
            const page = Number(request.nextUrl.searchParams.get('page') || 1);
            if (!['received', 'spent'].includes(type) || !Number.isSafeInteger(page) || page < 1 || page > 100000) {
                  return NextResponse.json({ status: 'failed', message: 'Invalid History Filter' }, { status: 400 });
            }

            await migrateBalanceHistory(user._id);
            const filter = { userId: user._id, amount: type === 'received' ? { $gt: 0 } : { $lt: 0 } };
            const history = await BalanceTransaction.find(filter).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * 20).limit(20)
                  .select('_id amount balanceAfter reason counterparty orderId createdAt').lean();
            const total = await BalanceTransaction.countDocuments(filter);
            return NextResponse.json({ status: 'success', balance: user.balance, history, total }, { headers: { 'Cache-Control': 'no-store' } });
      } catch (error) {
            console.error('Error loading balance history:', error);
            return NextResponse.json({ status: 'failed', message: 'Unable To Load Balance History. Please Try Again.' }, { status: 500 });
      }
}
