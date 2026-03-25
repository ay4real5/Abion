/**
 * Test script to verify the webhook endpoint
 * Run with: npx tsx scripts/test-webhook.ts
 */

const WEBHOOK_URL = 'http://localhost:3000/api/webhook';

// Sample Instagram DM payload
const samplePayload = {
  object: 'instagram',
  entry: [
    {
      id: '123456789',
      time: Math.floor(Date.now() / 1000),
      messaging: [
        {
          sender: {
            id: '987654321', // Instagram sender ID
          },
          recipient: {
            id: '123456789', // Business account ID
          },
          timestamp: Math.floor(Date.now() / 1000),
          message: {
            mid: 'msg_123456', // Message ID
            text: 'Hello! This is a test message from the webhook script.',
          },
        },
      ],
    },
  ],
};

async function testWebhook() {
  console.log('🚀 Sending POST request to webhook...\n');
  console.log(`URL: ${WEBHOOK_URL}`);
  console.log(`Payload:`, JSON.stringify(samplePayload, null, 2));
  console.log('\n---\n');

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(samplePayload),
    });

    const data = await response.json();

    console.log(`✅ Response Status: ${response.status}`);
    console.log(`Response Body:`, JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✨ Webhook test successful!');
    } else {
      console.log('\n⚠️ Webhook returned an error.');
    }
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error');
    console.log(
      '\n💡 Make sure the Next.js server is running on port 3000 (npm run dev)'
    );
    process.exit(1);
  }
}

testWebhook();
