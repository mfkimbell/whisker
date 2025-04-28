// src/app/api/webhook/conversations/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { BOT_NAME, sendConversationMessage } from '@/lib/twilio';

import { identifyUser } from '@/lib/segment-server';

export async function POST(request: Request) {
  console.log('🔔 /api/webhook/conversations invoked');
  const raw = await request.text();
  console.log('📥 Raw body:', raw);
  const form = new URLSearchParams(raw);
  const incoming = form.get('From'); 
  const body = form.get('Body')?.trim();
  const authorIdentity = form.get('ProfileName') || '';

  console.log('📑 Parsed fields:', { incoming, body, authorIdentity });

  if (!incoming) {
    console.error('❌ No From field in payload—cannot identify user');
    return NextResponse.json({}, { status: 200 });
  }
  const phone = incoming.replace('whatsapp:', '');
  console.log('ℹ️ Looking up user by phone:', phone);

  let user;
  try {
    user = await prisma.user.findUnique({ where: { phone } });
    console.log('ℹ️ User record:', user);
  } catch (dbErr: any) {
    console.error('❌ DB lookup error:', dbErr);
    return NextResponse.json({ error: dbErr.message }, { status: 500 });
  }

  if (!user?.conversationSid) {
    console.error('❌ No conversationSid in DB for user', user?.id);
    return NextResponse.json({}, { status: 200 });
  }

  if (!body) {
    console.log('ℹ️ Empty body; nothing to reply');
  } else if (authorIdentity === BOT_NAME) {
    console.log('ℹ️ Message came from bot; skipping');
  } else {
    const reply = `Just welcomed a new kitten? 🐾 We'd love to help! Use promo code KITTENLOVE for 10% off any kitten-related products at checkout. Browse here: https://whisker-omega.vercel.app/`
    console.log(`✉️ Sending reply to ${user.conversationSid}: "${reply}"`);
    try {
      const msg = await sendConversationMessage(user.conversationSid, reply);
      console.log('✅ Reply sent, SID=', msg.sid);
    } catch (sendErr: any) {
      console.error('❌ sendConversationMessage failed:', sendErr);
    }

    identifyUser(user.id, { smsOptIn: true })
      .then(() => console.log('✅ smsOptIn updated in Segment for', user.id))
      .catch((segErr: any) => console.error('❌ Failed to update smsOptIn in Segment:', segErr));
  }

  return NextResponse.json({}, { status: 200 });
}
