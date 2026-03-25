type SendMessageParams = {
  recipient_id: string;
  message_text: string;
};

type SendMessageResult =
  | {
      success: true;
      messageId?: string;
      raw?: unknown;
    }
  | {
      success: false;
      error: string;
      status?: number;
      raw?: unknown;
    };

const GRAPH_API_BASE = 'https://graph.facebook.com/v23.0';

export async function sendMessage({
  recipient_id,
  message_text,
}: SendMessageParams): Promise<SendMessageResult> {
  const accessToken =
    process.env.INSTAGRAM_ACCESS_TOKEN ?? process.env.INSTAGRAM_PAGE_ACCESS_TOKEN;

  if (!accessToken || accessToken.startsWith('your_')) {
    return {
      success: false,
      error:
        'INSTAGRAM_ACCESS_TOKEN is not configured. Add it to your environment variables.',
    };
  }

  if (!recipient_id?.trim()) {
    return {
      success: false,
      error: 'recipient_id is required.',
    };
  }

  if (!message_text?.trim()) {
    return {
      success: false,
      error: 'message_text is required.',
    };
  }

  const endpoint = `${GRAPH_API_BASE}/me/messages?access_token=${encodeURIComponent(
    accessToken
  )}`;

  const payload = {
    recipient: { id: recipient_id },
    messaging_type: 'RESPONSE',
    message: { text: message_text },
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const raw = (await response.json().catch(() => null)) as
      | {
          message_id?: string;
          error?: { message?: string };
        }
      | null;

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error:
          raw?.error?.message ??
          `Instagram Graph API request failed with status ${response.status}.`,
        raw,
      };
    }

    return {
      success: true,
      messageId: raw?.message_id,
      raw,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown error while sending Instagram message.',
    };
  }
}
