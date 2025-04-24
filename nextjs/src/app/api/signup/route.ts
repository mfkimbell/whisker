// app/api/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createUser } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { email, phone, anonymousId } = await req.json();
  const id = uuidv4();
  createUser({
    id,
    email,
    phone,
    anonymousId,
    phoneVerified: false,
    smsOptIn: false,
  });
  return NextResponse.json({ userId: id });
}
