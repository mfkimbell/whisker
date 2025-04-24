// app/api/verify/send/route.ts
import { NextResponse } from 'next/server';
import Twilio from 'twilio';

const client = Twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

const mitch = '+12053128982';

//removed req: NextRequest
export async function POST() {
  await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
    .verifications.create({ to: mitch, channel: 'sms' });

  return NextResponse.json({ success: true });
}
