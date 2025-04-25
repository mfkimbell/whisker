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
  try {
    const { phone, code } = await req.json();
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;

    // 1) Verify the OTP
    const verification = await checkVerificationCode(formattedPhone, code);
    if (verification.status !== 'approved') {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
    }

    // 2) Load the user
    const user = await prisma.user.findUnique({
      where: { phone: formattedPhone },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 3) Mark phoneVerified
    await prisma.user.update({
      where: { id: user.id },
      data: { phoneVerified: true },
    });

    // 🎉 CODE OK — respond immediately!
    const response = NextResponse.json({ success: true });
    // Detach heavy work to background
    void (async () => {
      try {
        // 4) Ensure a Conversation exists
        let convSid = user.conversationSid;
        if (!convSid) {
          convSid = await createConversationForUser(user.id, formattedPhone);
          await prisma.user.update({
            where: { id: user.id },
            data: { conversationSid: convSid },
          });
        }

        // 5) Send opt-in prompt
        await sendConversationMessage(
          convSid,
          '🎉 Thanks for verifying! Reply *YES* here on WhatsApp to confirm cat tips & deals.',
        );

        // 6) Segment identify + track
        await identifyUser(user.id, {
          phone: formattedPhone,
          phoneVerified: true,
          smsOptIn: false,
        });
        await trackEvent(user.id, 'Phone Verified');
      } catch (err) {
        console.error('Background task failed:', err);
      }
    })();

    return response;
  } catch (err: any) {
    console.error('Error in /api/verify/check:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
