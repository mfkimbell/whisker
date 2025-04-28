// src/app/api/verify/check/route.ts
// checks to see if the user got the verification code correct
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkVerificationCode } from '@/lib/twilio';

export async function POST(req: Request) {
  console.log("CHECK IS BEING CALLED")
  const { phone, code } = await req.json();
  const formatted = phone.startsWith('+') ? phone : `+${phone}`;

  const result = await checkVerificationCode(formatted, code);
  if (result.status !== 'approved') {
    return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
  }

  // mark verified in DB
  const user = await prisma.user.update({
    where: { phone: formatted },
    data: { phoneVerified: true },
  });

  return NextResponse.json({
    success: true,
    userId: user.id,
    phone: formatted,
  });
}
