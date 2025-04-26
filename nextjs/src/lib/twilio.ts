// src/lib/twilio.ts
"use server";

import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
export const twilioClient = twilio(accountSid, authToken);

const VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID!;
const CONVERSATIONS_SERVICE_SID = process.env.TWILIO_CONVERSATIONS_SERVICE_SID!;

// WhatsApp sandbox number (demo only)
export const FROM_WHATSAPP = 'whatsapp:+14155238886';
export const BOT_NAME = 'WhiskerAI';

/**
 * Send a Twilio Verify code via SMS.
 */
export async function sendVerificationCode(phone: string) {
  console.log(`[Twilio] sendVerificationCode → to=${phone}`);
  try {
    const to = phone.startsWith('+') ? phone : `+${phone}`;
    const res = await twilioClient.verify
      .services(VERIFY_SERVICE_SID)
      .verifications.create({ to, channel: 'sms' });
    console.log(`[Twilio] Verification SMS sent, SID=${res.sid}`);
    return res;
  } catch (err: any) {
    console.error('[Twilio] sendVerificationCode error:', err);
    throw err;
  }
}

/**
 * Check a Twilio Verify code.
 */
export async function checkVerificationCode(phone: string, code: string) {
  console.log(`[Twilio] checkVerificationCode → to=${phone}, code=${code}`);
  try {
    const to = phone.startsWith('+') ? phone : `+${phone}`;
    const res = await twilioClient.verify
      .services(VERIFY_SERVICE_SID)
      .verificationChecks.create({ to, code });
    console.log(`[Twilio] Verification result status=${res.status}`);
    return res;
  } catch (err: any) {
    console.error('[Twilio] checkVerificationCode error:', err);
    throw err;
  }
}

/**
 * Create a Twilio Conversation for a user and return its SID.
 * Persisting side-effects (e.g., saving to Redux or database) should be handled externally.
 */
export async function createConversationForUser(userId: string, phone: string) {
  const toWhatsApp = `whatsapp:${phone}`;
  console.log(`[Twilio] createConversationForUser → user=${userId}, address=${toWhatsApp}`);

  // 1) List all existing conversations
  const convs = await twilioClient.conversations.v1
    .services(CONVERSATIONS_SERVICE_SID)
    .conversations.list();
  console.log(`[Twilio] Found ${convs.length} conversations`);

  // 2) Delete any old ones for this number
  await Promise.all(
    convs.map(async (conv) => {
      const parts = await twilioClient.conversations.v1
        .services(CONVERSATIONS_SERVICE_SID)
        .conversations(conv.sid)
        .participants.list();
      if (parts.some((p) => (p.messagingBinding as any)?.address === toWhatsApp)) {
        try {
          await twilioClient.conversations.v1
            .services(CONVERSATIONS_SERVICE_SID)
            .conversations(conv.sid)
            .remove();
          console.log(`[Twilio] Deleted old conversation ${conv.sid}`);
        } catch (cleanupErr: any) {
          console.warn(`[Twilio] Could not delete ${conv.sid}:`, cleanupErr.message);
        }
      }
    }),
  );

  // 3) Create a new conversation
  const conv = await twilioClient.conversations.v1
    .services(CONVERSATIONS_SERVICE_SID)
    .conversations.create({
      friendlyName: `Conversation for ${userId}`,
      attributes: JSON.stringify({ userId, phone }),
    });
  console.log(`[Twilio] Created conversation ${conv.sid}`);

  return conv.sid;
}

/**
 * Send a chat message as the bot into a Conversation.
 */
export async function sendConversationMessage(
  conversationSid: string,
  body: string,
) {
  console.log(`[Twilio] sendConversationMessage → convSid=${conversationSid}, body="${body}"`);
  try {
    const msg = await twilioClient.conversations.v1
      .services(CONVERSATIONS_SERVICE_SID)
      .conversations(conversationSid)
      .messages.create({ author: BOT_NAME, body });
    console.log(`[Twilio] Message sent, SID=${msg.sid}`);
    return msg;
  } catch (err: any) {
    console.error('[Twilio] sendConversationMessage error:', err);
    throw err;
  }
}
