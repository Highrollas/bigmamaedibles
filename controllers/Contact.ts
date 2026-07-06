/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendFirstErrorMessage } from "@/app/Helper";
import { sendEmail } from "@/libs/emailService";
import { contactFormSchema } from "@/schema";
import { NextRequest, NextResponse } from "next/server";


export const submitForm = async (req: NextRequest) => {

      try {

            const body = await req.json();
            const result = contactFormSchema.safeParse(body);

            if (!result.success) {
                  return NextResponse.json({
                        status: "failed", message: sendFirstErrorMessage(result)
                  }, { status: 400 });
            }

            const mailSent = await sendEmail({
                  from: "contact-form",
                  template: "contact-form",
                  subject: "Site Contact Form",
                  replyTo: result.data.email,
                  data: {
                        ...result.data,
                  },
                  to: "support@bigmamasedibles.cc"
            });

            // //send to gmail also
            await sendEmail({
                  from: "contact-form",
                  template: "contact-form",
                  subject: "Site Contact Form (backup)",
                  data: {
                        ...result.data,
                  },
                  to: "ralphgibson121212@gmail.com"
            });

            if (mailSent) {
                  return NextResponse.json({
                        status: "success"
                  })
            }

            return NextResponse.json({
                  status: "failed", message: "Error submitting Form: Try Again Later"
            })

      } catch (error: any) {
            console.error("error @validateUser", error.message);
            return NextResponse.json({
                  status: "failed", message: "Server Error: Kindly try again later"
            })
      }

}