
import { logout } from "@/controllers/AdminAuth";
import { NextResponse } from "next/server";


export function GET() {
      return NextResponse.json({
            status: "failed", message: "NOT FOUND"
      })
}

export async function POST() {
      return await logout();
}
