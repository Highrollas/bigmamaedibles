import { bulkUpdateOrderStatus } from "@/controllers/Order";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
      return NextResponse.json({
            status: "failed", message: "NOT FOUND"
      })
}

export async function POST(req: NextRequest) {
      return bulkUpdateOrderStatus(req)
}

export async function PUT() {
      return NextResponse.json({
            status: "failed", message: "NOT FOUND"
      })
}

export async function DELETE() {
      return NextResponse.json({
            status: "failed", message: "NOT FOUND"
      })
}

