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

    const formatted = phone.startsWith('+') ? phone : `+${phone}`;

    // 1) Verify the OTP
    console.log('🔍 Checking verification code...');
    const verification = await checkVerificationCode(formatted, code);
    console.log('🔍 Verification status:', verification.status);
    if (verification.status !== 'approved') {
      console.warn('⚠️ Verification failed');
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
    }

    // 2) Load user
    const user = await prisma.user.findUnique({ where: { phone: formatted } });
    if (!user) {
      console.error('❌ User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 3) Mark verified
    await prisma.user.update({
      where: { id: user.id },
      data: { phoneVerified: true },
    });
    console.log('✅ Marked phoneVerified');

    // 4) Ensure Conversation exists
    let convSid = user.conversationSid;
    if (!convSid) {
      console.log('➕ Creating conversation for user', user.id);
      convSid = await createConversationForUser(user.id, formatted);
      await prisma.user.update({
        where: { id: user.id },
        data: { conversationSid: convSid },
      });
      console.log('💾 Saved new conversationSid:', convSid);
    } else {
      console.log('ℹ️ Found existing conversationSid:', convSid);
    }

    // 5) Send opt-in prompt (now awaited!)
    console.log('✉️ Sending opt-in message...');
    const msg = await sendConversationMessage(
      convSid,
      '🎉 Thanks for verifying! Reply *YES* here on WhatsApp to confirm cat tips & deals.',
    );
    console.log('✅ sendConversationMessage completed, SID=', msg.sid);

    // 6) Segment identify + track (also awaited)
    console.log('📊 Identifying user in Segment');
    await identifyUser(user.id, {
      phone: formatted,
      phoneVerified: true,
      smsOptIn: false,
    });
    console.log('📊 Tracking "Phone Verified" event');
    await trackEvent(user.id, 'Phone Verified');

    // finally respond
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('🚨 Error in /api/verify/check:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
