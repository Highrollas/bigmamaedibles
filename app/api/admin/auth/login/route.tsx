
import { login } from "@/controllers/AdminAuth";
import { NextRequest, NextResponse } from "next/server";


export function GET() {
      return NextResponse.json({
            status: "failed", message: "NOT FOUND"
      })
}

export async function POST(req: NextRequest) {
      return await login(req);
}
