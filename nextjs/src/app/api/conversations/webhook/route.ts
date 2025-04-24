// src/app/api/verify/check/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Twilio from 'twilio';

const client = Twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

const VERIFY_SID = process.env.TWILIO_VERIFY_SERVICE_SID!;
const CONV_SID = process.env.TWILIO_CONVERSATIONS_SERVICE_SID!;
const TO_WHATSAPP = process.env.MITCH_WHATSAPP_NUMBER!; // "whatsapp:+12053128982"
const FROM_WHATSAPP = process.env.TWILIO_WHATSAPP_NUMBER!; // "whatsapp:+14155238886"

export async function POST(req: NextRequest) {
  const { code, userId } = await req.json();
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  // 1) Verify the OTP via SMS
  const check = await client.verify.v2.services(VERIFY_SID).verificationChecks.create({
    to: TO_WHATSAPP.replace('whatsapp:', ''), // raw E.164 for Verify
    code,
  });

  if (check.status !== 'approved') {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
  }

  // 2) Clean up old WhatsApp conversations
  console.log('🔍 Deleting any existing WhatsApp binding for', TO_WHATSAPP);
  const allConvs = await client.conversations.v1
    .services(CONV_SID)
    .conversations.list({ limit: 50 });

  for (const conv of allConvs) {
    const parts = await client.conversations.v1
      .services(CONV_SID)
      .conversations(conv.sid)
      .participants.list({ limit: 50 });

    if (parts.some((p) => p.messagingBinding?.address === TO_WHATSAPP)) {
      try {
        await client.conversations.v1.services(CONV_SID).conversations(conv.sid).remove();
        console.log(`🗑️ Deleted conversation ${conv.sid}`);
      } catch (e: any) {
        console.warn(`⚠️ Failed to delete conversation ${conv.sid}:`, e.message);
      }
    }
  }

  // 3) Create a fresh Conversation
  const conv = await client.conversations.v1.services(CONV_SID).conversations.create({
    friendlyName: `Whisker_${userId}`,
    uniqueName: `Whisker_${userId}`,
  });
  const convSid = conv.sid;
  console.log('✅ Created new conversation', convSid);

  // 4) Add WhatsApp participant
  try {
    await client.conversations.v1.services(CONV_SID).conversations(convSid).participants.create({
      'messagingBinding.address': TO_WHATSAPP,
      'messagingBinding.proxyAddress': FROM_WHATSAPP,
    });
    console.log('✅ WhatsApp participant added');
  } catch (e: any) {
    if (e.code === 50416) {
      console.log('ℹ️ Binding already existed, skipping');
    } else {
      console.error('❌ Error adding WhatsApp participant:', e);
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  // 5) Add AI bot participant
  await client.conversations.v1
    .services(CONV_SID)
    .conversations(convSid)
    .participants.create({ identity: 'WhiskerAI' });
  console.log('✅ AI bot participant added');

  // 6) Send opt-in prompt **with logging**:
  try {
    const msg = await client.conversations.v1
      .services(CONV_SID)
      .conversations(convSid)
      .messages.create({
        author: 'WhiskerAI',
        body: '🎉 Thanks for verifying! Reply *YES* here on WhatsApp to confirm cat tips & deals from Whisker. Reply *STOP* to cancel.',
      });
    console.log(`📤 Opt-in prompt sent (Message SID: ${msg.sid})`);
  } catch (err) {
    console.error('❌ Failed to send opt-in prompt:', err);
  }

  // 7) Return the live Conversation SID
  return NextResponse.json({ success: true, conversationSid: convSid });
}
