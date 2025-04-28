// app/api/webhook/email/route.ts

import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

export const runtime = "nodejs"; // SendGrid SDK relies on Node APIs

sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "");

interface EmailPayload {
  to: string; 
  subject: string;
  text?: string;
  html?: string;
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as EmailPayload;

    if (!payload?.to || !payload?.subject || (!payload.text && !payload.html)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const msg: any = {
      to: payload.to,
      from: "noreply@summittechconsulting.org", 
      subject: payload.subject,
      text: payload.text ?? undefined,
      html: payload.html ?? undefined,
    };

    await sgMail.send(msg);

    return NextResponse.json({ status: "sent" });
  } catch (err: unknown) {
    console.error("SendGrid error", err);

    if (err instanceof Error && "response" in err) {
      return NextResponse.json(
        { error: (err as any).response?.body ?? err.message },
        { status: 502 }
      );
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
