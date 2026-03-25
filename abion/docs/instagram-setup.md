# Instagram Messaging Setup Guide (Meta)

This guide walks through connecting real Instagram DMs to your webhook endpoint.

## 1. Create a Meta App

1. Go to [Meta for Developers](https://developers.facebook.com/).
2. Create a new app (typically **Business** app type).
3. In your app dashboard, add:
   - **Messenger** product (used for Instagram Messaging API)
   - **Webhooks** product
4. Ensure your Instagram account is a **Professional account** (Business or Creator) and linked to a Facebook Page.

## 2. Add Required Permissions

In App Review and your token generation flow, you will need permissions such as:

- `instagram_basic`
- `instagram_manage_messages`
- `pages_manage_metadata`
- `pages_messaging`

For development mode, these work for app roles (admin/developer/tester). For production use, submit permissions for review.

## 3. Configure Webhook Endpoint

Your callback URL should point to:

- `https://<your-public-domain>/api/webhook`

For local development, expose your dev server via a tunnel (for example, ngrok) and use the HTTPS URL.

Example local tunnel callback URL:

- `https://abc123.ngrok-free.app/api/webhook`

### Expose localhost to the internet (required for Meta verification)

Meta cannot call `http://localhost:3000` directly. You must expose your local server with a public HTTPS tunnel.

#### Option A: ngrok

1. Start your app locally:

```bash
npm run dev
```

2. In a new terminal, start ngrok on port 3000:

```bash
ngrok http 3000
```

3. Copy the HTTPS forwarding URL from ngrok, for example:

```text
https://abc123.ngrok-free.app
```

4. In Meta Webhooks settings, use this callback URL:

```text
https://abc123.ngrok-free.app/api/webhook
```

5. Keep both `npm run dev` and ngrok running while you verify and test events.

#### Option B: Cloudflare Tunnel (cloudflared)

1. Start your app:

```bash
npm run dev
```

2. In a new terminal:

```bash
cloudflared tunnel --url http://localhost:3000
```

3. Copy the generated public HTTPS URL and append `/api/webhook` in Meta.

#### Option C: LocalTunnel

1. Start your app:

```bash
npm run dev
```

2. In a new terminal:

```bash
npx localtunnel --port 3000
```

3. Use the returned HTTPS URL + `/api/webhook` as your callback URL.

#### Quick verification test

After setting the callback URL in Meta, verify your endpoint responds correctly:

```bash
curl "https://<your-public-url>/api/webhook?hub.mode=subscribe&hub.verify_token=<your_token>&hub.challenge=123456"
```

Expected response body:

```text
123456
```

If verification fails, double-check:

- The tunnel URL is HTTPS and still active.
- The callback URL ends with `/api/webhook`.
- The verify token in Meta exactly matches `META_VERIFY_TOKEN`.
- Your local server is running and using the latest `.env.local`.

## 4. Implement Webhook Verification (GET)

Meta verifies webhooks by sending a GET request with query params:

- `hub.mode`
- `hub.verify_token`
- `hub.challenge`

You must:

1. Compare `hub.verify_token` with your own secret token.
2. Return `hub.challenge` as plain text when valid.
3. Return 403 when invalid.

Use an env var (example in `.env.local`):

```env
META_VERIFY_TOKEN=your_verify_token_here
```

Example handler addition for `src/app/api/webhook/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.META_VERIFY_TOKEN;

  if (mode === 'subscribe' && token && verifyToken && token === verifyToken) {
    return new NextResponse(challenge ?? '', { status: 200 });
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}
```

## 5. Set Webhook in Meta App

In your app:

1. Open **Webhooks**.
2. Choose **Instagram** object.
3. Click **Edit callback URL** / **Add callback URL**.
4. Enter:
   - Callback URL: your `/api/webhook` HTTPS URL
   - Verify Token: same value as `META_VERIFY_TOKEN`
5. Complete verification.

## 6. Subscribe to Instagram Messaging Events

After webhook verification, subscribe your app to message-related fields for Instagram. Common fields include:

- `messages`
- `messaging_postbacks`
- `messaging_seen`

In some dashboards/versions, field names shown can vary slightly. Select all messaging-related Instagram webhook fields available.

## 7. Get a Page Access Token

Instagram messaging uses the connected Facebook Page context.

1. In **Graph API Explorer** or your auth flow, generate a **User Access Token** with required scopes.
2. Exchange for a long-lived user token (recommended for server use).
3. Call:

```http
GET https://graph.facebook.com/v23.0/me/accounts?access_token=<USER_ACCESS_TOKEN>
```

4. From the response, copy the `access_token` for the Page linked to your Instagram account.
5. Store it securely in your server env, for example:

```env
META_PAGE_ACCESS_TOKEN=your_page_access_token_here
```

## 8. Send Replies Back to Instagram (Next Integration Step)

Once incoming messages are verified and parsed, send replies via the Messenger API for Instagram using the Page Access Token.

Typical endpoint:

```http
POST https://graph.facebook.com/v23.0/me/messages?access_token=<META_PAGE_ACCESS_TOKEN>
```

Request body pattern:

```json
{
  "recipient": { "id": "<INSTAGRAM_SENDER_ID>" },
  "messaging_type": "RESPONSE",
  "message": { "text": "Your AI reply here" }
}
```

## 9. Production Checklist

- Use HTTPS callback URLs only.
- Keep app secrets and tokens in environment variables.
- Add request signature validation (`X-Hub-Signature-256`) before trusting payloads.
- Add retries/idempotency for webhook handling.
- Complete App Review for required permissions before going live.

## Troubleshooting

- **Verification fails**: callback URL is unreachable or verify token mismatch.
- **No events received**: app not subscribed to Instagram fields, or account/page linkage missing.
- **Permission errors**: token lacks required scopes, app still in development mode for non-role users.
- **Can receive but not reply**: wrong token type (need Page Access Token), expired token, or missing messaging permissions.
