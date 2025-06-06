// src/app/api/webhook/cart-abandoned/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendConversationMessage } from "@/lib/twilio";
import { identifyUser } from "@/lib/segment-server";

export async function POST(request: Request) {
  console.log("🔔 /api/webhook/cart-abandoned invoked");

  const contentType = request.headers.get("content-type") || "";
  let phone: string | null = null;
  let cartId: string | null = null;

  if (contentType.includes("application/json")) {
    try {
      const body = await request.json();
      console.log("📥 JSON body:", body);
      phone = body.phone;
      cartId = body.cartId;
    } catch (err: any) {
      console.error("❌ JSON parse error:", err);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
  } else {
    const raw = await request.text();
    console.log("📥 Raw body:", raw);
    const form = new URLSearchParams(raw);
    phone = form.get("phone");
    cartId = form.get("cartId");
  }

  if (!phone || !cartId) {
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

  const reminder = `Whoops! Looks like you left items in your cart. 🛒 You can finish checking out here: https://whisker-omega.vercel.app/`;
  console.log(
    `✉️ Sending cart reminder to ${user.conversationSid}: "${reminder}"`
  );
  try {
    const msg = await sendConversationMessage(user.conversationSid, reminder);
    console.log("✅ Reminder sent, SID=", msg.sid);
  } catch (sendErr: any) {
    console.error("❌ sendConversationMessage failed:", sendErr);
  }

  identifyUser(user.id, { cartAbandoned: cartId });

  return NextResponse.json({ success: true }, { status: 200 });
}
