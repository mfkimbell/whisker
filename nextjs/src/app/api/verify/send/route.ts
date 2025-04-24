// app/api/verify/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Twilio from 'twilio';
import { getUser } from '@/lib/db';

const client = Twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

const mitch = '+12053128982';

export async function POST(req: NextRequest) {
  const { phone } = await req.json();
  await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
    .verifications.create({ to: mitch, channel: 'sms' });

  return NextResponse.json({ success: true });
}
