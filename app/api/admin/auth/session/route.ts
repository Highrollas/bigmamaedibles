;
import { validateAdminSession } from "@/controllers/AdminAuth";
import { NextResponse } from "next/server";


export async function GET() {
      return await validateAdminSession();
}

export async function POST() {
      return NextResponse.json({
            status: "failed", message: "NOT FOUND"
      })
}
