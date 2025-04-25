// src/lib/twilio.ts
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
  const to = phone.startsWith('+') ? phone : `+${phone}`;
  return twilioClient.verify
    .services(VERIFY_SERVICE_SID)
    .verifications.create({ to, channel: 'sms' });
}

/**
 * Check a Twilio Verify code.
 */
export async function checkVerificationCode(phone: string, code: string) {
  const to = phone.startsWith('+') ? phone : `+${phone}`;
  return twilioClient.verify.services(VERIFY_SERVICE_SID).verificationChecks.create({ to, code });
}

/**
 * Create (once) a Twilio Conversation for a user and add WhatsApp + bot participants.
 * Deletes any existing Conversation for that WhatsApp number in parallel.
 * Returns the new Conversation SID.
 */
export async function createConversationForUser(userId: string, phone: string) {
  const toWhatsApp = `whatsapp:${phone}`;
  console.log(`🔍 Checking existing bindings for ${toWhatsApp}`);

  // 1) List all conversations
  const convs = await twilioClient.conversations.v1
    .services(CONVERSATIONS_SERVICE_SID) // <-- explicit v1.services
    .conversations.list();

  // 2) Delete matching conversations in parallel
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
          console.log(`🗑️ Deleted conversation ${conv.sid}`);
        } catch (err: any) {
          console.warn(`⚠️ Could not delete ${conv.sid}:`, err.message);
        }
      }
    }),
  );

  // 3) Create a fresh conversation
  const conv = await twilioClient.conversations.v1
    .services(CONVERSATIONS_SERVICE_SID)
    .conversations.create({
      friendlyName: `Conversation for ${userId}`,
      attributes: JSON.stringify({ userId, phone }),
    });
  console.log(`✅ Created conversation ${conv.sid}`);

  // 4) Add WhatsApp participant + bot in parallel
  await Promise.all([
    twilioClient.conversations.v1
      .services(CONVERSATIONS_SERVICE_SID)
      .conversations(conv.sid)
      .participants.create({
        'messagingBinding.address': toWhatsApp,
        'messagingBinding.proxyAddress': FROM_WHATSAPP,
      }),
    twilioClient.conversations.v1
      .services(CONVERSATIONS_SERVICE_SID)
      .conversations(conv.sid)
      .participants.create({ identity: BOT_NAME }),
  ]);
  console.log('✅ Participants added');

  return conv.sid;
}

/**
 * Send a chat message as the bot into a Conversation.
 */
export async function sendConversationMessage(conversationSid: string, body: string) {
  const msg = await twilioClient.conversations.v1
    .services(CONVERSATIONS_SERVICE_SID)
    .conversations(conversationSid)
    .messages.create({ author: BOT_NAME, body });
  console.log(`✅ Sent message: ${msg.sid}`);
  return msg;
}
