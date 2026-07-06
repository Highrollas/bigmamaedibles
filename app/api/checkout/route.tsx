import { processOrder } from "@/controllers/Checkout";
import { NextRequest, NextResponse } from "next/server";

export function GET() {
      return NextResponse.json({
            status: "failed", message: "NOT FOUND"
      })
}

export async function POST(req: NextRequest) {
      return await processOrder(req);
}

export function PUT() {
      return NextResponse.json({
            status: "failed", message: "NOT FOUND"
      })
}

export function PATCH() {
      return NextResponse.json({
            status: "failed", message: "NOT FOUND"
      })
}

