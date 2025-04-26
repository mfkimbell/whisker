// app/api/webhook/email/route.ts
// Next.js (App Router) route handler that sends an email via Twilio SendGrid.
// --------------------------------------------------------------
// 1. Make sure you have `@sendgrid/mail` installed:
//    npm i @sendgrid/mail
// 2. Add SENDGRID_API_KEY to your environment (e.g., .env.local)
// 3. Your "from" address (noreply@summittechconsulting.org) must be
//    verified in SendGrid (either Single Sender or Domain Auth).
// --------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

export const runtime = "nodejs"; // SendGrid SDK relies on Node APIs

// Initialise the SendGrid client once per process.
sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "");

// Shape of the expected POST body
interface EmailPayload {
  to: string; // recipient email
  subject: string;
  text?: string;
  html?: string;
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as EmailPayload;

    // Basic validation
    if (!payload?.to || !payload?.subject || (!payload.text && !payload.html)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const msg: any = {
      to: payload.to,
      from: "noreply@summittechconsulting.org", // verified sender
      subject: payload.subject,
      text: payload.text ?? undefined,
      html: payload.html ?? undefined,
    };

    await sgMail.send(msg);

    return NextResponse.json({ status: "sent" });
  } catch (err: unknown) {
    console.error("SendGrid error", err);

    // Distinguish between user error and internal error
    if (err instanceof Error && "response" in err) {
      return NextResponse.json(
        { error: (err as any).response?.body ?? err.message },
        { status: 502 }
      );
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
