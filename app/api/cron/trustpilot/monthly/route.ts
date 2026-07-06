import { sendMonthTrustpilotMessage } from '@/controllers/Order';
import { NextResponse } from 'next/server';

export async function GET() {
      await sendMonthTrustpilotMessage();
      return NextResponse.json({ status: "success", message: "cron job recieved" });
}
