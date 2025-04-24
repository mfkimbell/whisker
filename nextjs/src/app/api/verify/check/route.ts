// app/api/verify/check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Twilio from 'twilio';
import { getUser, verifyUserPhone, setConversationSid } from '@/lib/db';

const client = Twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

export async function POST(req: NextRequest) {
  const { phone, code, userId } = await req.json();
  if (!phone || !code || !userId) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  // 1) Verify OTP
  const check = await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
    .verificationChecks.create({ to: phone, code });
  if (check.status !== 'approved') {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
  }

  // 2) Mark verified
  verifyUserPhone(userId);

  // 3) Create Conversation
  const conv = await client.conversations.v1
    .services(process.env.TWILIO_CONVERSATIONS_SERVICE_SID!)
    .conversations.create({ friendlyName: `Whisker_${userId}` });

  // 4) Add SMS participant
  await client.conversations.v1
    .services(process.env.TWILIO_CONVERSATIONS_SERVICE_SID!)
    .conversations(conv.sid)
    .participants.create({
      'messagingBinding.address': phone,
      'messagingBinding.proxyAddress': process.env.TWILIO_PHONE_NUMBER,
    });

  // 5) Add AI agent
  await client.conversations.v1
    .services(process.env.TWILIO_CONVERSATIONS_SERVICE_SID!)
    .conversations(conv.sid)
    .participants.create({ identity: 'WhiskerAI' });

  // 6) Save convSid and default smsOptIn to false
  setConversationSid(userId, conv.sid);

  // 7) Send double opt-in prompt
  await client.conversations.v1
    .services(process.env.TWILIO_CONVERSATIONS_SERVICE_SID!)
    .conversations(conv.sid)
    .messages.create({
      author: 'WhiskerAI',
      body: 'Thanks for verifying! Reply YES to confirm cat tips via SMS (msg&data rates may apply). Reply STOP to cancel.',
    });

  return NextResponse.json({ success: true });
}
