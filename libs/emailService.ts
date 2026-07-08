/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import nodemailer from "nodemailer";
import { CURRENCY_SYMBOL } from "@/constants";
import { sleep } from "@/app/Helper";

interface SendEmailParams {
      to: string;
      subject: string;
      from: string; // local part, e.g., "info"
      template: string;
      data: Record<string, any>;
      replyTo?: string | null;
}

/**
 * Register Handlebars partials (runs on demand)
 */
function registerPartials() {
      const partialsDir = path.join(process.cwd(), "emails", "partials");
      if (!fs.existsSync(partialsDir)) return;

      const filenames = fs.readdirSync(partialsDir);
      filenames.forEach((filename) => {
            const match = /^([^.]+)\.hbs$/.exec(filename);
            if (!match) return;

            const name = match[1];
            const filepath = path.join(partialsDir, filename);
            const content = fs.readFileSync(filepath, "utf8");
            handlebars.registerPartial(name, content);
      });
}

/**
 * Register custom Handlebars helpers
 */
function registerHelpers() {
      handlebars.registerHelper("multiply", (a: number, b: number) => a * b);
      handlebars.registerHelper("formatCurrency", (amount: number) => {
            return CURRENCY_SYMBOL + Number(amount).toLocaleString();
      });
      handlebars.registerHelper("eq", function (this: any, a: any, b: any, options?: any) {
            // Handle block helper usage
            if (options && typeof options.fn === "function") {
                  return a === b ? options.fn(this) : options.inverse(this);
            }
            // Handles inline usage
            return a === b;
      });
}

/**
 * Compile and return HTML from Handlebars template
 */
function getTemplate(templateName: string, data: Record<string, any>): string {
      registerPartials();
      registerHelpers();

      const templatePath = path.join(process.cwd(), "emails", `${templateName}.hbs`);
      if (!fs.existsSync(templatePath)) {
            throw new Error(`Email template not found: ${templatePath}`);
      }

      const source = fs.readFileSync(templatePath, "utf8");
      const compiledTemplate = handlebars.compile(source);
      return compiledTemplate(data);
}

/**
 * Factory: create a new Nodemailer transporter
 */
function createTransporter() {
      return nodemailer.createTransport({
            host: process.env.MAILBOX_SERVER,
            port: 465,
            secure: true, // SSL
            auth: {
                  user: process.env.MAILBOX_USER!,
                  pass: process.env.MAILBOX_PASS!,
            },
            pool: true,
            maxConnections: 50, // increase pool size
            maxMessages: 1000,  // allow more per connection
            rateLimit: 20,      // avoid hitting mailbox.org hourly limits
      });
}

/**
 * Global transporter (persist across reloads)
 */
const globalForMailer = globalThis as unknown as { transporter?: nodemailer.Transporter };
if (!globalForMailer.transporter) {
      globalForMailer.transporter = createTransporter();
}
let transporter = globalForMailer.transporter;

/**
 * Main function to send an email (retry up to 5 times)
 */
export async function sendEmail({
      to,
      subject,
      from,
      template,
      data,
      replyTo = null,
}: SendEmailParams) {

      return true;

      const html = getTemplate(template, data);
      const fullFrom = `Big Mamas Edibles <${from}@bigmamasedibles.cc>`;

      const mailOptions: any = {
            from: fullFrom,
            to,
            subject,
            html,
      };
      if (replyTo) {
            mailOptions.replyTo = replyTo;
      }

      for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                  const result = await transporter.sendMail(mailOptions);
                  console.log(`✅ SMTP email sent (attempt ${attempt}):`, result.messageId);
                  return true;
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {

                  // console.warn(`❌ SMTP failed (attempt ${attempt}):`, err);

                  if (attempt < 5) {
                        // console.warn("⏳ Waiting 2s before retry...");
                        await sleep(1000);

                        // console.warn("🔄 Recreating transporter & retrying...");
                        transporter = createTransporter();
                        globalForMailer.transporter = transporter; // update global
                  } else {
                        console.error("❌ All retries failed, giving up.");
                        return false;
                  }
            }
      }
}
