import { NextRequest, NextResponse } from 'next/server';
import { optInUserSms, findUserByPhone } from '@/lib/db';
import { segment } from '@/lib/segment-server';
import Twilio from 'twilio';

const client = Twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

const CONV_SERVICE_SID = process.env.TWILIO_CONVERSATIONS_SERVICE_SID!;
const WHISKER_BOT = 'WhiskerAI';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const bodyText = await req.text();
  const params = new URLSearchParams(bodyText);

  const from = params.get('From')?.replace('whatsapp:', '') ?? null;
  const messageBody = params.get('Body')?.trim();

  console.log('📨 Incoming WhatsApp Webhook');
  console.log('🧾 From:', from);
  console.log('📩 Body:', messageBody);

  if (!from || !messageBody) {
    console.warn('⚠️ Missing required parameters. Skipping.');
    return NextResponse.json({}, { status: 200 });
  }

  if (messageBody.toUpperCase() === 'YES') {
    const user = findUserByPhone(from);
    if (!user) {
      console.warn(`⚠️ No user found with phone ${from}`);
      return NextResponse.json({}, { status: 200 });
    }

    optInUserSms(user.id);
    console.log(`✅ User ${user.id} opted in`);

    await segment.identify({
      userId: user.id,
      traits: { smsOptIn: true },
    });

    await segment.track({
      userId: user.id,
      event: 'SMS Opt-In (WhatsApp)',
    });

    console.log('📬 Segment identify/track complete');

    // 💬 Send reward message into conversation
    if (user.conversationSid) {
      const body = `🎉 Thanks for signing up, ${user.email || 'friend'}! Here's a free code: *WHISKER100* 🐾`;

      await client.conversations.v1
        .services(CONV_SERVICE_SID)
        .conversations(user.conversationSid)
        .messages.create({
          author: WHISKER_BOT,
          body,
        });

      console.log(`📤 Sent confirmation reward message to conversation ${user.conversationSid}`);
    } else {
      console.warn('⚠️ No conversationSid found for user');
    }
  } else {
    console.log(`📭 Received other message: "${messageBody}" from ${from}`);
  }

  return NextResponse.json({}, { status: 200 });
}
