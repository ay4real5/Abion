/**
 * WhatsApp Business API — placeholder structure.
 * Will be wired up once widget is live and we have users.
 * Uses the same handleMessage() core — just a different transport layer.
 */

import { handleMessage } from './message-handler';

export type WhatsAppWebhookBody = {
  entry?: Array<{
    changes?: Array<{
      value?: {
        messages?: Array<{
          from: string;
          text?: { body: string };
          type: string;
        }>;
      };
    }>;
  }>;
};

/**
 * Verify webhook from Meta (same pattern as Instagram)
 */
export function verifyWhatsAppWebhook(
  mode: string | null,
  token: string | null,
  challenge: string | null
): string | null {
  if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
    return challenge;
  }
  return null;
}

/**
 * Process incoming WhatsApp message and return AI response.
 * Call this from your /api/whatsapp/route.ts when ready.
 */
export async function handleWhatsAppWebhook(body: WhatsAppWebhookBody) {
  const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (!message || message.type !== 'text' || !message.text?.body) {
    return { success: false, error: 'Not a text message or invalid payload.' };
  }

  const result = await handleMessage({
    platform: 'whatsapp',
    user_id: message.from,
    message: message.text.body,
  });

  // TODO: Send reply back via WhatsApp Cloud API
  // await sendWhatsAppMessage(message.from, result.response);

  return result;
}
