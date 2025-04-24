// app/api/verify/check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Twilio from 'twilio';

const client = Twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

export async function POST(req: NextRequest) {
  const { phone, code } = await req.json();

  if (!phone) {
    return NextResponse.json({ error: 'Missing phone in request' }, { status: 400 });
  }

  console.log(`Verifying code "${code}" for phone ${phone}`);

  try {
    const check = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verificationChecks.create({ to: phone, code });

    console.log('Twilio verify response:', check);

    if (check.status === 'approved') {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Invalid code or not approved' }, { status: 400 });
    }
  } catch (err: any) {
    console.error('Verify check error:', err);
    return NextResponse.json(
      { error: err.message || 'Verify failed' },
      { status: err.status || 500 },
    );
  }
}
