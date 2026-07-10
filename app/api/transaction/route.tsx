import { checkTransactionStatus } from "@/controllers/Transaction";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
      return await checkTransactionStatus(req);
}

export async function POST() {
      return NextResponse.json({
            status: "failed", message: "NOT FOUND"
      })
}

