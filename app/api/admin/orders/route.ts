import { deleteOrder, adminFetchOrders, updateOrder } from "@/controllers/Order";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
      return await adminFetchOrders(req);
}

export async function POST() {
      return NextResponse.json({
            status: "failed", message: "NOT FOUND"
      })
}

export async function PUT(req: NextRequest) {
      return await updateOrder(req);
}

export async function DELETE(req: NextRequest) {
      return await deleteOrder(req);
}

