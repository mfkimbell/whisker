// lib/db.ts
export type User = {
  id: string;
  email: string;
  phone: string;
  anonymousId?: string;
  phoneVerified: boolean;
  smsOptIn: boolean;
  conversationSid?: string; // <— new
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

// <— new: store the Conv SID
export function setConversationSid(id: string, convSid: string) {
  const u = users.get(id);
  if (u) u.conversationSid = convSid;
  return u;
}

// <— new: lookup by Conv SID for the webhook
export function findUserByConversationSid(convSid: string): User | undefined {
  for (const u of users.values()) {
    if (u.conversationSid === convSid) return u;
  }
  return undefined;
}

export function optInUserSms(id: string) {
  const u = users.get(id);
  if (u) u.smsOptIn = true;
  return u;
}
