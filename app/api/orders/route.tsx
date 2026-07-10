import { fetchUserOrders } from "@/controllers/Order";
import { NextResponse } from "next/server";

export async function GET() {
      return await fetchUserOrders();
}

export async function POST() {
      return NextResponse.json({
            status: "failed", message: "NOT FOUND"
      })
}



