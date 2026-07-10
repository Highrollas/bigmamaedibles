import { updateUser } from "@/controllers/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
      return NextResponse.json({
            status: "failed", message: "NOT FOUND"
      })
}

export async function POST(req: NextRequest) {
      return await updateUser(req);
}

