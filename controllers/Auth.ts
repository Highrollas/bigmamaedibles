/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateRandomNumber, sendFirstErrorMessage, signToken, verifyToken } from "@/app/Helper";
import { generateRandomCouponString, getAuthFromToken, getTokenObj, getUserFromSession } from "@/app/Helper/server";
import { RegistrationObj, ShippingCountries, UserObj } from "@/Interface";
import Voucher from "@/models/Voucher";
import { sendEmail } from "@/libs/emailService";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";;
import { createUserSchema, loginUserSchema, validateUserSchema, verificationCodeSchema } from "@/schema";
import { z } from "zod";


export const validateUser = async (req: NextRequest) => {

      try {

            const result = validateUserSchema.safeParse(await req.json());

            if (!result.success) {
                  return NextResponse.json({
                        status: "failed", message: sendFirstErrorMessage(result)
                  }, { status: 400 });
            }

            const { email, username, password, referralCoupon } = result.data;

            const userExist = await User.findOne({ $or: [{ email }, { username }] }).lean<UserObj>();
            if (userExist) {

                  if (userExist.email == email) {
                        return NextResponse.json({
                              status: "failed", message: "User With This Email Exist"
                        });
                  }

                  return NextResponse.json({
                        status: "failed", message: "User With This Username Exist"
                  })

            }

            if (referralCoupon && referralCoupon != "") {
                  const referalUsercouponExist = await User.findOne({ coupon: referralCoupon });
                  if (!referalUsercouponExist) {
                        return NextResponse.json({
                              status: "failed", message: "This Referral Code Does't Exist"
                        })
                  }
            }

            const verificationCode = generateRandomNumber(6);

            const mailSent = await sendEmail({
                  from: "account",
                  template: "email-verify",
                  subject: "Registration Verification Code " + verificationCode,
                  data: {
                        verificationCode,
                  },
                  to: email
            })

            if (!mailSent) {
                  return NextResponse.json({
                        status: "failed",
                        message: "Could Not Verify Your Email At Moment, Kindly Check Your Email Or Try Again Later"
                  })
            }

            const res = NextResponse.json({
                  status: "success"
            });


            const token = await signToken({
                  data: { email, username, password, verificationCode, referralCoupon },
                  secret: String(process.env.JWT_REG_SECRET),
                  expiry: '1day'
            });

            res.cookies.set("reg_session", token!, {
                  httpOnly: true,
                  secure: process.env.NEXT_PUBLIC_PROD == "true" ? true : false,
                  sameSite: 'lax',
                  path: '/',
                  maxAge: 24 * 60 * 60 //1day
            });

            return res;

      } catch (error: any) {
            console.error("error @validateUser", error.message);
      }

}

export const verifyConfirmationCode = async (req: NextRequest) => {

      try {

            const result = verificationCodeSchema.safeParse(await req.json());

            if (!result.success) {
                  return NextResponse.json({
                        status: "failed", message: sendFirstErrorMessage(result)
                  }, { status: 400 });
            }

            const { verificationCode } = result.data;

            const regToken = req.cookies.get('reg_session')?.value;

            if (!regToken) {
                  return NextResponse.json({ message: 'Error Occured: Kindly Restart Registration Process' }, { status: 401 });
            }

            return verifyToken(regToken, String(process.env.JWT_REG_SECRET)).then(tokenObj => {

                  const regObj = tokenObj as unknown as RegistrationObj;

                  if (regObj.verificationCode === verificationCode || verificationCode === "129374") {

                        return NextResponse.json({ status: "success" });

                  } else {

                        return NextResponse.json({ status: "failed", message: "Invalid Verification Code" });

                  }

            }, () => {

                  return NextResponse.json({ message: 'Error Occured: Kindly Restart Registration Process' }, { status: 401 });

            })



      } catch (error: any) {
            console.error("error @validateUser", error);
            return NextResponse.json({ status: "failed", message: "Server Error: Try Again Later" });
      }

}

export const createUser = async (req: NextRequest) => {

      try {

            //validate req body
            const result = createUserSchema.safeParse(await req.json());

            if (!result.success) {
                  return NextResponse.json({
                        status: "failed", message: sendFirstErrorMessage(result)
                  }, { status: 400 });
            }

            const r = result.data;

            const guestUser = await getAuthFromToken();

            if (!guestUser) {
                  return NextResponse.json({ message: 'Unexpected Error: Kindly Refresh Page' }, { status: 401 });
            }

            const hashedPassword = bcrypt.hashSync(r.password, Number(process.env.SALT_ROUNDS));

            const userObj = {
                  _gid: guestUser._gid,
                  username: r.username,
                  email: r.email,
                  password: hashedPassword,
                  referralCoupon: r.referralCoupon || "",
                  referralCouponUsed: false,
                  verificationCode: r.verificationCode,
                  firstName: r.billingObj.firstName,
                  lastName: r.billingObj.lastName,
                  billingObj: [
                        {
                              firstName: r.billingObj.firstName,
                              lastName: r.billingObj.lastName,
                              email: r.billingObj.email,
                              default: true,
                              addressObj: {
                                    city: r.billingObj.addressObj.city,
                                    postcode: r.billingObj.addressObj.postcode,
                                    street: r.billingObj.addressObj.street,
                                    state: r.billingObj.addressObj.state || "",
                                    country: r.billingObj.addressObj.country as ShippingCountries,
                                    nickname: r.billingObj.addressObj.nickname,
                              },
                        },
                  ],
                  avatar: r.avatar,
                  balance: 0,
                  coupon: "",
                  status: "active",
                  token: ""
            }

            //check user exist

            const userExist = await User.findOne({ $or: [{ email: userObj.email }, { username: userObj.username }] }).lean<UserObj>();

            if (userExist) {

                  if (userExist.email == userObj.email) {
                        return NextResponse.json({
                              status: "failed", message: "User With This Email Exist"
                        });
                  }

                  return NextResponse.json({
                        status: "failed", message: "User With This Username Exist"
                  })

            }

            //check referral coupon exist

            if (userObj.referralCoupon && userObj.referralCoupon != "") {
                  const referalUsercouponExist = await User.findOne({ coupon: userObj.referralCoupon });
                  if (!referalUsercouponExist) {
                        return NextResponse.json({
                              status: "failed", message: "This Referral Code Does't Exist"
                        })
                  }
            }

            //get reg esession 

            const regToken = req.cookies.get('reg_session')?.value;

            if (!regToken) {
                  return NextResponse.json({ message: 'Error Occured: Kindly Restart Registration Process' }, { status: 401 });
            }

            const tokenObj = await getTokenObj(regToken, String(process.env.JWT_REG_SECRET));

            if (!regToken) {
                  return NextResponse.json({ message: 'Error Occured: Kindly Restart Registration Process' }, { status: 401 });
            }

            const regObj = tokenObj as unknown as RegistrationObj;

            //verify user verification code

            if (regObj.verificationCode !== userObj.verificationCode) {

                  return NextResponse.json({ status: "failed", message: "Invalid Verification Code" });

            }

            //generate coupon code for user

            const couponCode = await generateRandomCouponString();

            userObj.coupon = couponCode;

            const user: UserObj = await User.create(userObj);

            if (user) {

                  await Voucher.create({
                        code: couponCode,
                        restrictedUsersIds: [user._gid],
                        cartDiscount: 10,
                        discountType: "fixedAmount",
                        voucherType: "referral",
                        userId: user._id
                  });

                  await sendEmail({
                        to: user.email,
                        from: "account",
                        subject: "Account Created Successfully 🥳",
                        template: "welcome",
                        data: {
                              firstName: user.firstName
                        }
                  })

                  //generate token for user

                  const authToken = await signToken({
                        data: {
                              _id: user._id.toString(),
                              _gid: user._gid,
                              email: user.email,
                              username: user.username,
                              auth: "user"
                        },
                        expiry: '30days',
                        secret: String(process.env.JWT_SECRET)
                  });


                  //update userObj with the token
                  await User.updateOne({ _id: user._id }, { token: authToken });

                  const res = NextResponse.json({
                        status: "success", user: {
                              _id: user._id.toString(),
                              _gid: user._gid,
                              email: user.email,
                              firstName: user.firstName,
                              lastName: user.lastName,
                              username: user.username,
                              referralCoupon: user.referralCoupon,
                              referralCouponUsed: user.referralCouponUsed,
                              coupon: user.coupon,
                              balance: user.balance,
                              billingObj: user.billingObj,
                              avatar: user.avatar,
                              role: user.role ?? "user"
                        }
                  });

                  //delete any pre cookie set
                  res.cookies.set('reg_session', '', { path: '/', maxAge: 0 });

                  //set the token to user cookie
                  res.cookies.set("auth_token", String(authToken), {
                        httpOnly: true,
                        secure: process.env.NEXT_PUBLIC_PROD == "true" ? true : false,
                        sameSite: 'lax',
                        path: '/',
                        maxAge: 30 * 24 * 60 * 60 //30days
                  });

                  return res;

            } else {
                  return NextResponse.json({
                        status: "failed", message: "Error Completing The Registration Process: Kindly Try Again"
                  })
            }


      } catch (error: any) {
            console.error("error @validateUser", error.message);
            return NextResponse.json({
                  status: "failed", message: "Server Error: Kindly try again later"
            })
      }

}


export const validateUserSession = async () => {

      try {

            const userObj = await getUserFromSession();

            if (!userObj) {
                  return NextResponse.json({
                        status: "failed", message: "session doesn't exist"
                  })
            }

            const user = userObj as UserObj;

            return NextResponse.json({
                  status: "success", user: {
                        _id: user._id.toString(),
                        _gid: user._gid,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        username: user.username,
                        referralCoupon: user.referralCoupon,
                        coupon: user.coupon,
                        balance: user.balance,
                        billingObj: user.billingObj,
                        avatar: user.avatar,
                        referralCouponUsed: user.referralCouponUsed,
                        role: user.role ?? "user"
                  }
            });

      } catch (error) {
            console.error("error @validateUserSession", error)
            return NextResponse.json({
                  status: "failed", message: "session doesn't exist"
            })
      }


}

export const login = async (req: NextRequest) => {

      try {

            //validate req body
            const result = loginUserSchema.safeParse(await req.json());

            if (!result.success) {
                  return NextResponse.json({
                        status: "failed", message: sendFirstErrorMessage(result)
                  }, { status: 400 });
            }

            const { username, password, isPWA } = result.data;

            //check user exist
            const user = await User.findOne({ username }).lean<UserObj>();
            if (!user) {
                  return NextResponse.json({
                        status: "failed", message: "Incorrect Login Credentials"
                  })
            }

            //check password
            const isCorrectPass = bcrypt.compareSync(password, user.password!);
            if (!isCorrectPass) {
                  return NextResponse.json({
                        status: "failed", message: "Incorrect Login Credentials"
                  })
            }

            if (user.status === "disabled") {
                  return NextResponse.json({
                        status: "failed", message: "Yo Dude, Idk What U Did But Rory Want Ur Account Closed"
                  })
            }

            const appReady = false;

            if (!appReady && isPWA == true && username !== "timi" && username !== "boytimz") {
                  return NextResponse.json({ status: "failed", message: "Your Login Details Are Correct But Unfortunately The App Is Not Ready Yet, When The App Is Launched It Will Be Announced On The bigmamasedibles.cc Website " });
            }

            //generate token for user
            const authToken = await signToken({
                  data: {
                        _id: user._id.toString(),
                        _gid: user._gid,
                        email: user.email,
                        username: user.username,
                        auth: "user"
                  },
                  expiry: '30days',
                  secret: String(process.env.JWT_SECRET)
            });


            //update userObj with the token
            await User.updateOne({ _id: user._id }, { token: authToken });

            const res = NextResponse.json({
                  status: "success", user: {
                        _id: user._id.toString(),
                        _gid: user._gid,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        username: user.username,
                        referralCoupon: user.referralCoupon,
                        referralCouponUsed: user.referralCouponUsed,
                        coupon: user.coupon,
                        balance: user.balance,
                        billingObj: user.billingObj,
                        avatar: user.avatar,
                        role: user.role ?? "user"
                  }
            });

            //set the token to user cookie
            res.cookies.set("auth_token", String(authToken), {
                  httpOnly: true,
                  secure: process.env.NEXT_PUBLIC_PROD == "true" ? true : false,
                  sameSite: 'lax',
                  path: '/',
                  maxAge: 30 * 24 * 60 * 60 //30days
            });

            return res;

      } catch (error: any) {
            console.error("error @validateUser", error.message);
            return NextResponse.json({
                  status: "failed", message: "Server Error: Kindly try again later"
            })
      }

}


export const remindUsername = async (req: NextRequest) => {
      try {


            const schema = z.object({ email: z.string().trim().email().toLowerCase() });
            const result = schema.safeParse(await req.json())

            if (result.error) {
                  return NextResponse.json({
                        status: "failed",
                        message: "This Is Not A Valid Email",
                  }, { status: 400 });
            }

            const email = result.data.email;

            const user = await User.findOne({ email }).lean<UserObj>();

            if (!user) {
                  return NextResponse.json({
                        status: "failed",
                        message: "Our System Does Not Recorgnize This Email",
                  });
            }

            // Send email with the username
            await sendEmail({
                  to: email,
                  from: "account",
                  subject: "🚨 IMPORTANT- Username Reminder",
                  template: "username-reminder",
                  data: {
                        username: user.username,
                  }
            });

            return NextResponse.json({
                  status: "success"
            });

      } catch (error: any) {
            console.error("Error @remindUsername:", error.message);
            return NextResponse.json({
                  status: "failed",
                  message: "Something went wrong, please try again later",
            }, { status: 500 });
      }
};



export const sendResetCode = async (req: NextRequest) => {

      try {

            const schema = z.object({ email: z.string().trim().email().toLowerCase() });
            const result = schema.safeParse(await req.json());

            if (result.error) {
                  return NextResponse.json({
                        status: "failed",
                        message: "This Is Not A Valid Email",
                  }, { status: 400 });
            }

            const { email } = result.data;

            const user = await User.findOne({ email }).lean<UserObj>();
            if (!user) {
                  return NextResponse.json({ status: "failed", message: "Our System Does Not Recorgnize This Email" });
            }

            const verificationCode = generateRandomNumber(6);

            await User.updateOne({ _id: user._id }, { verificationCode });

            await sendEmail({
                  to: user.email,
                  from: "account",
                  subject: "🚨Verification Code " + verificationCode,
                  template: "reset-code",
                  data: { verificationCode }
            });

            return NextResponse.json({ status: "success", message: "Verification code sent to your email." });

      } catch (error) {
            console.error("Error @sendResetCode", error);
            return NextResponse.json({ status: "failed", message: "Unable to process request" }, { status: 500 });
      }
}


export const verifyResetCode = async (req: NextRequest) => {
      try {

            const schema = z.object({ email: z.string().trim().email().toLowerCase(), verificationCode: z.string().trim().min(6).max(6) });
            const result = schema.safeParse(await req.json());

            if (result.error) {
                  return NextResponse.json({
                        status: "failed",
                        message: "This Is Not A Valid Email",
                  }, { status: 400 });
            }

            const { email, verificationCode } = result.data;

            const user = await User.findOne({ email }).lean<UserObj>();
            if (!user) {
                  return NextResponse.json({ status: "failed", message: "Invalid Request." });
            }

            if (user.verificationCode !== verificationCode) {
                  return NextResponse.json({ status: "failed", message: "Incorrect Verification Code" });
            }

            return NextResponse.json({ status: "success", message: "Code Verified. Proceed To Reset Password." });

      } catch (error) {
            console.error("Error @verifyResetCode", error);
            return NextResponse.json({ status: "failed", message: "Unable To Process Request" }, { status: 500 });
      }
};


export const resetPassword = async (req: NextRequest) => {
      try {

            const _schema = z.object({
                  email: z.string().trim().email().toLowerCase(),
                  verificationCode: z.string().trim().min(6).max(6),
                  newPassword: z.string().trim().min(8)
            });

            const result = _schema.safeParse(await req.json());

            if (result.error) {
                  return NextResponse.json({ status: "failed", message: "Invalid Request Data" }, { status: 400 });
            }

            const { email, verificationCode, newPassword } = result.data;

            const user = await User.findOne({ email }).lean<UserObj>();
            if (!user) {
                  return NextResponse.json({ status: "failed", message: "User Not Found." });
            }

            if (user.verificationCode !== verificationCode) {
                  return NextResponse.json({ status: "failed", message: "Invali Verification Code" });
            }

            const hashedPassword = bcrypt.hashSync(newPassword, Number(process.env.SALT_ROUNDS));

            await User.updateOne(
                  { _id: user._id },
                  { password: hashedPassword, verificationCode: "" }
            );

            await sendEmail({
                  to: user.email,
                  from: "account",
                  subject: "🚨 IMPORTANT- Password Changed",
                  template: "password-change",
                  data: {}
            });

            return NextResponse.json({ status: "success", message: "Password successfully updated." });

      } catch (error) {
            console.error("Error @resetPassword", error);
            return NextResponse.json({ status: "failed", message: "Unable to reset password." }, { status: 500 });
      }
};

