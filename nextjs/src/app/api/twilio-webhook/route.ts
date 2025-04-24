// app/api/twilio-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Twilio from 'twilio';
import { findUserByConversationSid, optInUserSms } from '@/lib/db';

export async function POST(req: NextRequest) {
  // Twilio sends form-encoded payload
  const form = await req.formData();
  const eventType = form.get('EventType') as string;
  if (eventType !== 'onMessageAdded') return NextResponse.json({}, { status: 200 });

  const convSid = form.get('ConversationSid') as string;
  const body = (form.get('Body') as string).trim().toUpperCase();

  // Only handle YES
  if (body === 'YES') {
    const user = findUserByConversationSid(convSid);
    if (user) {
      // mark them opted in
      optInUserSms(user.id);

      // send confirmation
      const client = Twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
      await client.conversations.v1
        .services(process.env.TWILIO_CONVERSATIONS_SERVICE_SID!)
        .conversations(convSid)
        .messages.create({
          author: 'WhiskerAI',
          body: '🎉 You’re all set! You’ll now receive cat care tips & deals. Ask me anything.',
        });
    }
  }

  return NextResponse.json({}, { status: 200 });
}
