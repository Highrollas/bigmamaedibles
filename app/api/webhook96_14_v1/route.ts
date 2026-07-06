import { handleWebhook } from "@/controllers/Transaction";
import { NextRequest, NextResponse } from "next/server";


export async function POST() {
      return NextResponse.json({
            status: 'success',
            message: 'Hello mother fucker 🫡',
      });
}

export async function GET(req: NextRequest) {
      return handleWebhook(req);
}
