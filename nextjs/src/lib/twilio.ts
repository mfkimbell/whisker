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
 * Send a chat message as the bot into a Conversation.
 */
export async function sendConversationMessage(conversationSid: string, body: string) {
  console.log(`✉️ [Twilio] sendConversationMessage → convSid=${conversationSid}, body="${body}"`);
  try {
    const msg = await twilioClient.conversations.v1
      .services(CONVERSATIONS_SERVICE_SID)
      .conversations(conversationSid)
      .messages.create({ author: BOT_NAME, body });
    console.log('✅ [Twilio] Message sent, SID=', msg.sid);
    return msg;
  } catch (err: any) {
    console.error('❌ [Twilio] sendConversationMessage failed:', err);
    throw err;
  }
}

/**
 * Create (once) a Twilio Conversation for a user and add WhatsApp + bot participants.
 */
export async function createConversationForUser(userId: string, phone: string) {
  const toWhatsApp = `whatsapp:${phone}`;
  console.log(`🔍 [Twilio] createConversationForUser for ${userId} / ${toWhatsApp}`);

  // 1) List all conversations
  const convs = await twilioClient.conversations.v1
    .services(CONVERSATIONS_SERVICE_SID)
    .conversations.list();
  console.log(`ℹ️ Found ${convs.length} existing conversations`);

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
          console.log(`🗑️ [Twilio] Deleted conversation ${conv.sid}`);
        } catch (err: any) {
          console.warn(`⚠️ [Twilio] Could not delete ${conv.sid}:`, err.message);
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
  console.log(`✅ [Twilio] Created conversation ${conv.sid}`);

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
  console.log('✅ [Twilio] Participants added to conversation');

  return conv.sid;
}

// (other Verify functions below if you want logging there as well…)
