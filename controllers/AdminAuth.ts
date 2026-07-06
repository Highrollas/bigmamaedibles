/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";;
import { loginAdminchema, verifyEmailSchema } from "@/schema";
import { generateRandomNumber, sendFirstErrorMessage, signToken } from "@/app/Helper";
import Admin from "@/models/Admin";
import { AdminObj } from "@/Interface";
import { getAdminFromSession } from "@/app/Helper/server";
import { z } from "zod";
import { sendEmail } from "@/libs/emailService";


export const verifyConfirmationCode = async (req: NextRequest) => {

      try {

            const result = verifyEmailSchema.safeParse(await req.json());

            if (!result.success) {
                  return NextResponse.json({
                        status: "failed", message: sendFirstErrorMessage(result)
                  }, { status: 400 });
            }

            const { verificationCode, email } = result.data;

            const regToken = req.cookies.get('reg_session')?.value;

            if (!regToken) {
                  return NextResponse.json({ message: 'Error Occured: Kindly Restart Registration Process' }, { status: 401 });
            }

            const adminObj = await Admin.findOne({ email }).lean<AdminObj>();

            if (adminObj && adminObj.verificationCode === verificationCode) {

                  return NextResponse.json({ status: "success" });

            } else {

                  return NextResponse.json({ status: "failed", message: "Invalid Verification Code" });

            }

      } catch (error: any) {
            console.error("error @verifyConfirmationCode", error);
            return NextResponse.json({ status: "failed", message: "Server Error: Try Again Later" });
      }

}

export const validateAdminSession = async () => {

      try {

            const adminObj = await getAdminFromSession();

            if (!adminObj) {
                  return NextResponse.json({
                        status: "failed", message: "session doesn't exist"
                  }, { status: 403 })
            }

            const admin = adminObj as AdminObj;

            return NextResponse.json({
                  status: "success", admin: {
                        _id: admin._id.toString(),
                        email: admin.email,
                        firstName: admin.firstName,
                        lastName: admin.lastName,
                        username: admin.username,
                        accessLevel: admin.accessLevel
                  }
            });

      } catch (error) {
            console.error("error @validateUserSession", error)
            return NextResponse.json({
                  status: "failed", message: "session doesn't exist"
            })
      }
}


export const sendLoginCode = async (req: NextRequest) => {

      const result = z.object({ email: z.string().trim().email().toLowerCase() }).safeParse(await req.json());

      if (!result.success) {
            return NextResponse.json({ status: "failed", message: sendFirstErrorMessage(result) }, { status: 400 });
      }

      const { email } = result.data;

      const admin = await Admin.findOne({ email });
      if (!admin) {
            return NextResponse.json({ status: "failed", message: "Hey Sucker!!! WTF Email You Provided 😤" });
      }

      if (admin.status !== "active") {
            return NextResponse.json({ status: "failed", message: `Your Account Is Currently ${admin.status.toUpperCase()}. Kindly Contact Admininstrator` });
      }

      const verificationCode = generateRandomNumber(6);
      const expiry = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes from now

      // update admin doc with code & expiry
      await Admin.updateOne({ _id: admin._id }, {
            verificationCode,
            verificationCodeExpiresAt: expiry
      });

      await sendEmail({
            from: "account",
            template: "reset-code",
            subject: "Login Code " + verificationCode,
            data: { verificationCode },
            to: email
      });

      return NextResponse.json({ status: "success" });
}


export const login = async (req: NextRequest) => {
      try {
            const result = loginAdminchema.safeParse(await req.json());

            if (!result.success) {
                  return NextResponse.json({ status: "failed", message: sendFirstErrorMessage(result) }, { status: 400 });
            }

            const { email, password, verificationCode } = result.data;

            const admin = await Admin.findOne({ email }).lean<AdminObj>();
            if (!admin) {
                  return NextResponse.json({ status: "failed", message: "Heyyyy Wait Minute 🫷. did u just change the email ? U Sausage 😂" });
            }

            if (!admin.verificationCode || !admin.verificationCodeExpiresAt) {
                  return NextResponse.json({ status: "failed", message: "No verification code found. Request again." });
            }

            const now = new Date();
            if (now > admin.verificationCodeExpiresAt) {
                  return NextResponse.json({ status: "failed", message: "You Late Dude, Verification code expired. Request a new one." });
            }

            if (verificationCode !== admin.verificationCode) {
                  return NextResponse.json({ status: "failed", message: "You Might Have To Pass The Back Door With That Code 😂" });
            }

            // check password
            const isCorrectPass = bcrypt.compareSync(password, admin.password!);
            if (!isCorrectPass) {
                  return NextResponse.json({ status: "failed", message: "Incorrect Login Credentials" });
            }

            if (admin.status !== "active") {
                  return NextResponse.json({ status: "failed", message: `Your Account Is Currently ${admin.status.toUpperCase()}. Kindly Contact Admininstrator` });
            }


            // generate token
            const authToken = await signToken({
                  data: {
                        _id: admin._id.toString(),
                        email: admin.email,
                        username: admin.username,
                        auth: "admin",
                        accessLevel: admin.accessLevel
                  },
                  expiry: admin.shortLived ? '3h' : '7days',
                  secret: String(process.env.ADMIN_JWT_SECRET)
            });

            // update admin: save token & remove code+expiry
            await Admin.updateOne({ _id: admin._id }, {
                  token: authToken,
                  $unset: { verificationCode: "", verificationCodeExpiresAt: "" }
            });

            const res = NextResponse.json({
                  status: "success", admin: {
                        _id: admin._id.toString(),
                        email: admin.email,
                        firstName: admin.firstName,
                        lastName: admin.lastName,
                        username: admin.username,
                        accessLevel: admin.accessLevel
                  }
            });

            res.cookies.set("admin_auth_token", String(authToken), {
                  httpOnly: true,
                  secure: process.env.NEXT_PUBLIC_PROD == "true",
                  sameSite: 'lax',
                  path: '/',
                  maxAge: admin.shortLived ? 3 * 60 * 60 : 7 * 24 * 60 * 60
            });

            await sendEmail({
                  from: "account",
                  template: "admin-notify",
                  subject: "Admin Login Notification",
                  data: { message: `This is to inform you that admin with email ${email} has just logged in to his admin account` },
                  to: "ralphgibson121212@gmail.com"
            });

            return res;

      } catch (error: any) {
            console.error("error @login", error.message);
            return NextResponse.json({ status: "failed", message: "Server Error: Kindly try again later" });
      }
}


export const logout = async () => {
      try {

            const admin = await getAdminFromSession();

            if (!admin) {
                  return NextResponse.json({ status: "failed", message: 'Invalid token' }, { status: 401 });
            }

            await Admin.updateOne({ _id: admin._id }, { $unset: { token: "" } });

            const res = NextResponse.json({ status: "success", message: "Logged out" });
            res.cookies.set("admin_auth_token", "", {
                  httpOnly: true,
                  secure: process.env.NEXT_PUBLIC_PROD == "true",
                  sameSite: "lax",
                  path: "/",
                  expires: new Date(0)
            });

            if (admin.shortLived) {
                  await sendEmail({
                        from: "account",
                        template: "admin-notify",
                        subject: "Admin Logout Notification",
                        data: { message: `This is to inform you that admin with email ${admin.email} has just logged out to his admin account` },
                        to: "ralphgibson121212@gmail.com"
                  });
            }

            return res;

      } catch (error: any) {
            console.error("error @logout", error.message);
            return NextResponse.json(
                  { status: "failed", message: "Server Error: Kindly try again later" },
                  { status: 500 }
            );
      }
};
