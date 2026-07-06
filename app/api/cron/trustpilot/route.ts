// import { sendTrustPilotMessage } from '@/controllers/Order';
import { NextResponse } from 'next/server';

export async function GET() {
      // await sendTrustPilotMessage();
      return NextResponse.json({ status: "success", message: "cron job recieved" });
}
