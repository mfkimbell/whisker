// src/lib/twilio.ts
import Twilio from 'twilio';

const client = Twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

const CONVERSATIONS_SERVICE_SID = process.env.TWILIO_CONVERSATIONS_SERVICE_SID!;

/**
 * Send a message into a Twilio Conversation.
 * @param conversationSid - the Conversation SID
 * @param body - the message text to send
 * @param author - optional author name (defaults to 'WhiskerAI')
 */
export async function sendConversationMessage(
  conversationSid: string,
  body: string,
  author: string = 'WhiskerAI',
) {
  return client.conversations.v1
    .services(CONVERSATIONS_SERVICE_SID)
    .conversations(conversationSid)
    .messages.create({ author, body });
}
