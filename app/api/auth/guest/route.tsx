/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateRandomString, signToken, verifyToken } from "@/app/Helper";
import { AuthUser } from "@/Interface";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

      let receivedToken = "empty";

      try {

            const { token: clientToken } = await req.json();
            receivedToken = clientToken;

            if (!clientToken || clientToken == "") {
                  return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
            }

            try {

                  await verifyToken(clientToken, String(process.env.NEXT_PUBLIC_GUEST_SECRET), false);

            } catch (error: any) {
                  // Check specifically if the error was because of expiry
                  if (error?.code === 'ERR_JWT_EXPIRED') {
                        console.log("failed token for bot");
                        //comtinue since this is a bot/crawler
                  } else {
                        console.error("Invalid guest token provided:", receivedToken);
                        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
                  }
            }

            const _id = generateRandomString(24);
            const user = {} as AuthUser;

            const token = await signToken({
                  data: { _id, _gid: _id },
                  secret: String(process.env.JWT_SECRET),
                  expiry: '20years'
            });


            if (token) {

                  const res = NextResponse.json({ status: 'success', user });

                  res.cookies.set('guest_token', token, {
                        httpOnly: true,
                        secure: process.env.NEXT_PUBLIC_PROD == "true" ? true : false,
                        sameSite: 'lax',
                        path: '/',
                        maxAge: 20 * 365 * 24 * 60 * 60 //20yrs lol
                  });

                  return res;

            } else {
                  return NextResponse.json({ status: 'failed', message: "error creating token" }, { status: 500 });
            }

      } catch (error) {

            console.error(error, " Invalid token provided ", receivedToken);
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

      }

}

export async function GET() {
      return NextResponse.json({
            status: 'success',
            message: 'Hello mother fucker 🫡',
      });
}

