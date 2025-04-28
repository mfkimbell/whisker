// src/app/api/webhook/potential-adopter/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
//import { sendConversationMessage } from "@/lib/twilio";


export async function POST(request: Request) {
  console.log("🔔 /api/webhook/potential-adopter invoked");
  const contentType = request.headers.get("content-type") || "";
  let phone: string | null = null;

  if (contentType.includes("application/json")) {
    try {
      const body = await request.json();
      console.log("📥 JSON body:", body);
      phone = body.phone;

    } catch (err: any) {
      console.error("❌ JSON parse error:", err);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
  } else {
    const raw = await request.text();
    console.log("📥 Raw body:", raw);
    const form = new URLSearchParams(raw);
    phone = form.get("phone");

  }

  if (!phone){
    console.error("❌ Missing phone or cartId");
    return NextResponse.json({}, { status: 200 });
  }

  const normalizedPhone = phone.startsWith("+") ? phone : `+${phone}`;
  console.log("ℹ️ Looking up user by phone:", normalizedPhone);

  let user;
  try {
    user = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
    console.log("ℹ️ User record:", user);
  } catch (dbErr: any) {
    console.error("❌ DB lookup error:", dbErr);
    return NextResponse.json({ error: dbErr.message }, { status: 500 });
  }

  if (!user?.conversationSid) {
    console.error("❌ No conversationSid in DB for user", user?.id);
    return NextResponse.json({}, { status: 200 });
  }

  const reminder = `Just welcomed a new kitten? 🐾 We'd love to help! Use promo code KITTENLOVE for 10% off any kitten-related products at checkout. Browse here: https://whisker-omega.vercel.app/`;
  console.log(
    `✉️ Sending cart reminder to ${user.conversationSid}: "${reminder}"`
  );
  try {
    // const msg = await sendConversationMessage(user.conversationSid, reminder);
    // console.log("✅ Reminder sent, SID=", msg.sid);
  } catch (sendErr: any) {
    console.error("❌ sendConversationMessage failed:", sendErr);
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
