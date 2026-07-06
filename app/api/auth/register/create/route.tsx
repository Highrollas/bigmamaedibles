import { createUser } from "@/controllers/Auth";
import { NextRequest, NextResponse } from "next/server";


export function GET() {
      return NextResponse.json({
            status: "failed", message: "NOT FOUND"
      })
}

export async function POST(req: NextRequest) {
      return await createUser(req);
}
