// src/app/api/conversations/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { findUserByPhone, optInUserSms, users } from '@/lib/db';
import { sendConversationMessage } from '@/lib/twilio';
import { segment } from '@/lib/segment-server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const text = await req.text();
  const params = new URLSearchParams(text);
  console.log('🗄️ [webhook] DB snapshot:', Array.from(users.values()));
  console.log('📨 [webhook] Raw payload:', text);

  const rawFrom = params.get('From'); // e.g. "whatsapp:+12053128982"
  const messageBody = params.get('Body')?.trim(); // e.g. "YES"

  console.log('[webhook] Sandbox inbound', { rawFrom, messageBody });

  if (!rawFrom || !messageBody || messageBody.toUpperCase() !== 'YES') {
    console.log('[webhook] Ignored (no YES or missing fields)');
    return NextResponse.json({}, { status: 200 });
  }

  const phone = rawFrom.replace(/^whatsapp:/, '').replace(/\D/g, '');
  console.log(`[webhook] Normalized phone: ${phone}`);

  const user = findUserByPhone(phone);
  console.log('[webhook] Matched user:', user);
  if (!user) {
    console.warn(`[webhook] No user found for phone ${phone}`);
    return NextResponse.json({}, { status: 200 });
  }

  // 1) Flip server-side opt-in
  optInUserSms(user.id);
  console.log(`[webhook] optInUserSms → true for ${user.id}`);

  // 2) Segment identify & track
  await segment.identify({ userId: user.id, traits: { smsOptIn: true } });
  await segment.track({ userId: user.id, event: 'SMS Opt-In' });
  console.log('[webhook] Segment updated');

  // 3) Reply in Conversation
  if (!user.conversationSid) {
    console.warn('[webhook] Missing conversationSid for user');
    return NextResponse.json({}, { status: 200 });
  }

  try {
    const sid = await sendConversationMessage(
      user.conversationSid,
      '🎉 Thanks for signing up! Here’s your free code: *WHISKER100* 🐾',
    );
    console.log('[webhook] Reward message sent, SID:', sid?.sid);
  } catch (err) {
    console.error('[webhook] Failed to send reward:', err);
  }

  return NextResponse.json({}, { status: 200 });
}
