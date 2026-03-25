import { NextRequest, NextResponse } from 'next/server';
import { handleMessage } from '@/lib/message-handler';

// Allow embedding from any origin (needed for the embeddable widget)
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, session_id } = body as { message?: string; session_id?: string };

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required.' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Use session_id as user_id (generated client-side, persists in localStorage)
    const userId = session_id ?? `widget_anon_${Date.now()}`;

    const result = await handleMessage({
      platform: 'widget',
      user_id: userId,
      message: message.trim(),
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      { response: result.response },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (err) {
    console.error('Widget API error:', err);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
