// src/app/api/signup/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, phone, anonymousId } = await request.json();
    if (!phone) {
      return NextResponse.json({ error: 'Phone is required' }, { status: 400 });
    }
    // normalize to E.164
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;

    // find or create the user
    let user = await prisma.user.findUnique({
      where: { phone: formattedPhone },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          phone: formattedPhone,
          email,
          anonymousId,
          phoneVerified: false,
          smsOptIn: false,
        },
      });
    }

    // return the id so the client can dispatch it into Redux
    return NextResponse.json({ userId: user.id });
  } catch (err: any) {
    console.error('Error in /api/signup:', err);
    return NextResponse.json({ error: err.message || 'Signup failed' }, { status: 500 });
  }
}
