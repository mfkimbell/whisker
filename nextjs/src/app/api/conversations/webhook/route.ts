// src/app/api/conversations/webhook/route.ts

import { NextResponse } from 'next/server';
import { BOT_NAME, sendConversationMessage } from '@/lib/twilio';

export async function POST(request: Request) {
  console.log('🔔 /api/conversations/webhook invoked');

  try {
    // Log raw body for troubleshooting
    const rawBody = await request.text();
    console.log('📥 Raw request body:', rawBody);

    // Parse form data
    const formData = new URLSearchParams(rawBody);
    const eventType      = formData.get('EventType');
    const conversationSid = formData.get('ConversationSid');
    const body           = formData.get('Body');
    const author         = formData.get('Author');

    console.log('📑 Parsed form fields:', {
      eventType,
      conversationSid,
      body,
      author,
    });

    // Only handle new messages
    if (eventType === 'onMessageAdd') {
      console.log('ℹ️ Event is onMessageAdd');

      if (!conversationSid || !body || !author) {
        console.warn('⚠️ Missing one of conversationSid/body/author, skipping response');
      } else if (author === BOT_NAME) {
        console.log(`ℹ️ Author is bot (${BOT_NAME}), skipping echo`);
      } else {
        // Echo the user's message
        const reply = `You said: ${body}`;
        console.log(`✉️ Sending reply to ${conversationSid}: "${reply}"`);

        try {
          const msg = await sendConversationMessage(conversationSid, reply);
          console.log('✅ Reply sent, message SID=', msg.sid);
        } catch (sendErr: any) {
          console.error('❌ sendConversationMessage failed:', sendErr);
        }
      }
    } else {
      console.log(`ℹ️ Ignoring event type: ${eventType}`);
    }

    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    console.error('🚨 Error in /api/conversations/webhook:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
