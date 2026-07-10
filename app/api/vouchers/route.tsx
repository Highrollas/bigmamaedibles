import { fetchVoucherSingle } from "@/controllers/Voucher";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
      return fetchVoucherSingle(req);
}

export async function GET() {
      return NextResponse.json({
            status: 'success',
            message: 'Hello mother fucker 🫡',
      });
}

