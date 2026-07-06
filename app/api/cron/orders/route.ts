import { autoDeliverShippedOrders, cancelLateOrder } from '@/controllers/Order';
import { NextResponse } from 'next/server';

export async function GET() {
      await cancelLateOrder();
      await autoDeliverShippedOrders();
      return NextResponse.json({ status: "success", message: "cron job received" });
}
