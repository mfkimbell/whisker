import { NextResponse } from 'next/server';
import { BOT_NAME, sendConversationMessage } from '@/lib/twilio';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const eventType = formData.get('EventType');
    if (eventType === 'onMessageAdd') {
      const conversationSid = formData.get('ConversationSid') as string;
      const body = formData.get('Body') as string;
      const author = formData.get('Author') as string;

      // If the message was sent by the user (not our bot), respond
      if (author && body && author !== BOT_NAME) {
        // Echo the user's message
        const reply = `You said: ${body}`;
        await sendConversationMessage(conversationSid, reply);
      }
    }
    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    console.error('Error in /api/conversations/webhook:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
