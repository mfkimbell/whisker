// src/app/api/conversations/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { findUserByConversationSid, optInUserSms } from '@/lib/db';
import { segment } from '@/lib/segment-server';

export const runtime = 'edge'; // or 'nodejs' if needed

export async function POST(req: NextRequest) {
  const bodyText = await req.text();
  const params = new URLSearchParams(bodyText);

  const eventType = params.get('EventType');
  const convSid = params.get('ConversationSid');
  const author = params.get('Author');
  const messageBody = params.get('Body')?.trim();

  console.log('📨 Incoming Twilio Webhook');
  console.log('🧾 Params:', {
    eventType,
    convSid,
    author,
    messageBody,
  });

  if (!eventType || !convSid || !messageBody) {
    console.warn('⚠️ Missing expected Twilio parameters. Skipping.');
    return NextResponse.json({}, { status: 200 });
  }

  if (eventType !== 'onMessageAdded') {
    console.log(`ℹ️ Ignored non-message event: ${eventType}`);
    return NextResponse.json({}, { status: 200 });
  }

  if (author === 'WhiskerAI') {
    console.log('🤖 Ignored bot message');
    return NextResponse.json({}, { status: 200 });
  }

  if (messageBody.toUpperCase() === 'YES') {
    console.log('✅ Detected YES opt-in');

    const user = findUserByConversationSid(convSid);
    if (!user) {
      console.warn(`🚫 No user found for conversation ${convSid}`);
      return NextResponse.json({}, { status: 200 });
    }

    optInUserSms(user.id);
    console.log(`📌 Updated smsOptIn for user ${user.id}`);

    await segment.identify({
      userId: user.id,
      traits: { smsOptIn: true },
    });
    console.log('📬 Sent Segment identify');

    await segment.track({
      userId: user.id,
      event: 'SMS Opt-In',
    });
    console.log('📈 Sent Segment track: SMS Opt-In');
  } else {
    console.log(`📭 Received other message from user: ${messageBody}`);
  }

  return NextResponse.json({}, { status: 200 });
}
