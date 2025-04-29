// src/app/api/verify/post-verify/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createConversationForUser, sendConversationMessage } from '@/lib/twilio';
import { identifyUser, trackEvent } from '@/lib/segment-server';

export async function POST(req: Request) {
  console.log('🔔 /api/verify/post-verify invoked');
  try {
    const { userId, phone } = await req.json();
    console.log(`👤 Post-verify for user=${userId}, phone=${phone}`);

    // 1) Ensure conversation exists
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    let convSid = existing?.conversationSid;
    if (!convSid) {
      console.log('➕ Creating new conversation for user', userId);
      convSid = await createConversationForUser(userId, phone);
      console.log('💾 Saving conversationSid:', convSid);
      await prisma.user.update({
        where: { id: userId },
        data: { conversationSid: convSid },
      });
    } else {
      console.log('ℹ️ Using existing conversationSid:', convSid);
    }

    // 2) Send the opt-in WhatsApp message
    console.log('✉️ Sending opt-in message to conversation', convSid);
    const msg = await sendConversationMessage(
      convSid,
      '🎉 Welcome Jane! Thanks for verifying! Reply *YES* here on WhatsApp to confirm cat tips & deals.',
    );
    console.log('✅ Message sent, SID=', msg.sid);

    // 3) Identify & track in Segment
    console.log('📊 Identifying user in Segment');
    await identifyUser(userId, { phone, phoneVerified: true, smsOptIn: false });
    console.log('📊 Tracking "Phone Verified" event');
    await trackEvent(userId, 'Phone Verified');
    console.log('✅ Post-verify background tasks complete for', userId);

    // 4) Return 204 No Content
    return new NextResponse(null, { status: 204 });
  } catch (err: any) {
    console.error('❌ Error in /api/verify/post-verify:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}