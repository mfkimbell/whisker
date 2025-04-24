// lib/db.ts
export type User = {
  id: string;
  email: string;
  phone: string;
  anonymousId?: string;
  phoneVerified: boolean;
  smsOptIn: boolean;
};

const users = new Map<string, User>();

export function createUser(u: User) {
  users.set(u.id, u);
  return u;
}

export function getUser(id: string): User | undefined {
  return users.get(id);
}

export function verifyUserPhone(id: string) {
  const u = users.get(id);
  if (u) u.phoneVerified = true;
  return u;
}
