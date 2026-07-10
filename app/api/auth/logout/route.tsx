import { getUserFromSession } from "@/app/Helper/server";
import User from "@/models/User";
import { NextResponse } from "next/server";

export function GET() {
      return NextResponse.json({
            status: "failed", message: "NOT FOUND"
      })
}

export async function POST() {

      const user = await getUserFromSession();
      if (user) {
            await User.updateOne({ _id: user._id }, { token: "" });
      }

      const res = NextResponse.json({ status: "success" });
      res.cookies.set('auth_token', '', { path: '/', maxAge: 0 });
      return res;
}

