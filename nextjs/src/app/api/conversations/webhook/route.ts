// src/app/api/conversations/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Twilio from 'twilio';
import { findUserByPhone, optInUserSms } from '@/lib/db';
import { segment } from '@/lib/segment-server';

const client = Twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

const CONV_SERVICE_SID = process.env.TWILIO_CONVERSATIONS_SERVICE_SID!;
const BOT_IDENTITY = 'WhiskerAI';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  // 1) Parse form-encoded body
  const text = await req.text();
  const params = new URLSearchParams(text);

  const rawFrom = params.get('From'); // e.g. "whatsapp:+12053128982"
  const messageBody = params.get('Body')?.trim(); // e.g. "YES"

  console.log('📨 Sandbox inbound', { rawFrom, messageBody });

  if (!rawFrom || !messageBody) {
    console.warn('⚠️ Missing From or Body—skipping.');
    return NextResponse.json({}, { status: 200 });
  }

  // 2) Only care about YES replies
  if (messageBody.toUpperCase() !== 'YES') {
    console.log(`ℹ️ Ignored message: "${messageBody}"`);
    return NextResponse.json({}, { status: 200 });
  }

  // 3) Normalize the WhatsApp phone and find the user
  const phone = rawFrom.replace(/^whatsapp:/, '').replace(/\D/g, '');
  console.log(`🔍 Looking up user by phone: ${phone}`);
  const user = findUserByPhone(phone);

  if (!user) {
    console.warn(`❌ No user found for phone ${phone}`);
    return NextResponse.json({}, { status: 200 });
  }

  // 4) Flip their opt-in flag and update Segment
  optInUserSms(user.id);
  console.log(`✅ Opted in user ${user.id}`);

  await segment.identify({ userId: user.id, traits: { smsOptIn: true } });
  await segment.track({ userId: user.id, event: 'SMS Opt-In' });
  console.log('📈 Segment updated');

  // 5) Send the thank-you message into their Conversation
  if (!user.conversationSid) {
    console.warn(`⚠️ No conversationSid for user ${user.id}`);
    return NextResponse.json({}, { status: 200 });
  }

  try {
    const msg = await client.conversations.v1
      .services(CONV_SERVICE_SID)
      .conversations(user.conversationSid)
      .messages.create({
        author: BOT_IDENTITY,
        body: '🎉 Thanks for signing up! Here’s your free code: *WHISKER100* 🐾',
      });
    console.log(`📤 Sent reward message (SID: ${msg.sid})`);
  } catch (err) {
    console.error('❌ Failed to send reward message:', err);
  }

  return NextResponse.json({}, { status: 200 });
}
