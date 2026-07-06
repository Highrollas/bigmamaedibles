import { validateUserSession } from "@/controllers/Auth";
import { NextResponse } from "next/server";


export async function GET() {
      return await validateUserSession();
}

export async function POST() {
      return NextResponse.json({
            status: "failed", message: "NOT FOUND"
      })
}
