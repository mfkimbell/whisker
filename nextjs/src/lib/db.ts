// src/lib/db.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // Ensure we have a global Prisma instance in dev to avoid exhausting DB connections
  // due to hot reloading in serverless environments like Next.js API routes
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create the Prisma client, using a global instance in development
const client = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = client;
}

export const prisma = client;
