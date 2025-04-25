// src/app/api/verify/check/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  checkVerificationCode,
  createConversationForUser,
  sendConversationMessage,
} from '@/lib/twilio';
import { identifyUser, trackEvent } from '@/lib/segment-server';

export async function POST(req: Request) {
  console.log('🔔 /api/verify/check invoked');
  try {
    const { phone, code } = await req.json();
    console.log(`📱 Received verify request for ${phone}, code=${code}`);

    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;

    // 1) Verify the OTP
    console.log('🔍 Checking verification code...');
    const verification = await checkVerificationCode(formattedPhone, code);
    console.log('🔍 Verification result:', verification.status);
    if (verification.status !== 'approved') {
      console.warn('⚠️ Verification failed');
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
    }

    // 2) Load the user
    console.log('📦 Looking up user record...');
    const user = await prisma.user.findUnique({
      where: { phone: formattedPhone },
    });
    if (!user) {
      console.error('❌ User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 3) Mark phoneVerified
    console.log(`✅ Marking phoneVerified for user ${user.id}`);
    await prisma.user.update({
      where: { id: user.id },
      data: { phoneVerified: true },
    });

    // Send immediate 200 back, then do heavy lifting in background
    const response = NextResponse.json({ success: true });
    void (async () => {
      try {
        console.log('⏳ Starting background tasks for user', user.id);

        // 4) Ensure a Conversation exists
        let convSid = user.conversationSid;
        if (!convSid) {
          console.log('➕ No conversationSid, creating one...');
          convSid = await createConversationForUser(user.id, formattedPhone);
          console.log('💾 Saving new conversationSid to user record:', convSid);
          await prisma.user.update({
            where: { id: user.id },
            data: { conversationSid: convSid },
          });
        } else {
          console.log('ℹ️ Existing conversationSid found:', convSid);
        }

        // 5) Send opt-in prompt
        console.log('✉️ Sending opt-in message...');
        const msg = await sendConversationMessage(
          convSid,
          '🎉 Thanks for verifying! Reply *YES* here on WhatsApp to confirm cat tips & deals.',
        );
        console.log('✉️ Opt-in message sent, SID=', msg.sid);

        // 6) Segment identify + track
        console.log('📊 Identifying user in Segment');
        await identifyUser(user.id, {
          phone: formattedPhone,
          phoneVerified: true,
          smsOptIn: false,
        });
        console.log('📊 Tracking Phone Verified event');
        await trackEvent(user.id, 'Phone Verified');
        console.log('✅ Background tasks complete for user', user.id);
      } catch (bgErr) {
        console.error('❌ Background task failed:', bgErr);
      }
    })();

    return response;
  } catch (err: any) {
    console.error('🚨 Error in /api/verify/check:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
