// src/app/api/conversations/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Twilio from 'twilio';
import { findUserByPhone } from '@/lib/db';
import { segment } from '@/lib/segment-server';

const client = Twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
const CONV_SID = process.env.TWILIO_CONVERSATIONS_SERVICE_SID!;
const BOT = 'WhiskerAI';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  // 1) Read the raw body as text (Twilio sends form-urlencoded)
  const bodyText = await req.text();
  const params = new URLSearchParams(bodyText);

  // 2) Extract the key fields
  // For a Conversations webhook (post-webhook), Twilio still posts form-encoded:
  const eventType = params.get('EventType');
  const convSid = params.get('ConversationSid');
  const author = params.get('Author');
  const messageBody = params.get('Body')?.trim();

  console.log('📨 Twilio Webhook', { eventType, convSid, author, messageBody });

  // 3) Only handle incoming user messages
  if (
    eventType === 'onMessageAdded' &&
    author !== BOT &&
    messageBody?.toUpperCase() === 'YES' &&
    convSid
  ) {
    // 4) Lookup user by conversation attributes
    const conv = await client.conversations.v1.services(CONV_SID).conversations(convSid).fetch();

    let userId: string | undefined;
    try {
      const attrs = JSON.parse(conv.attributes || '{}');
      userId = attrs.userId as string;
    } catch {
      console.warn('⚠️ Could not parse conversation.attributes:', conv.attributes);
    }

    if (!userId) {
      console.warn('⚠️ No userId found in attributes; skipping');
      return NextResponse.json({}, { status: 200 });
    }

    // 5) Flip the in-mem smsOptIn flag
    const user = findUserByPhone(params.get('Author')!.replace('whatsapp:', ''));
    if (!user) {
      console.warn('⚠️ No user found for phone', params.get('Author'));
      return NextResponse.json({}, { status: 200 });
    }
    user.smsOptIn = true;
    console.log(`✅ User ${user.id} opted in`);

    // 6) Send Segment identify + track
    await segment.identify({ userId, traits: { smsOptIn: true } });
    await segment.track({ userId, event: 'SMS Opt-In' });
    console.log('📈 Segment updated');

    // 7) Send reward message into the conversation
    try {
      const msg = await client.conversations.v1
        .services(CONV_SID)
        .conversations(convSid)
        .messages.create({
          author: BOT,
          body: `🎉 Thanks for signing up! Here’s your free code: WHISKER100 🐾`,
        });
      console.log('📤 Reward message sent, SID:', msg.sid);
    } catch (err) {
      console.error('❌ Failed to send reward message:', err);
    }
  } else {
    console.log('ℹ️ Ignored webhook event or non-YES message');
  }

  return NextResponse.json({}, { status: 200 });
}
