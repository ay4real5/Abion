import { NextRequest, NextResponse } from 'next/server'
import { handleMessage } from '@/lib/message-handler'
import { sendMessage } from '@/lib/instagram'

const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN

// Meta calls this to verify your webhook
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }

  return new NextResponse('Forbidden', { status: 403 })
}

// Meta sends messages here
export async function POST(req: NextRequest) {
  try {
    console.log('[WEBHOOK HIT] method=', req.method)

    const rawBody = await req.text()
    console.log('[META PAYLOAD] raw=', rawBody)

    let body: unknown
    try {
      body = JSON.parse(rawBody)
    } catch (parseError) {
      console.error('[SKIPPED] Invalid JSON payload', parseError)
      return NextResponse.json({ status: 'error', error: 'Invalid JSON payload' }, { status: 400 })
    }

    const typedBody = body as { object?: string; entry?: Array<{ messaging?: unknown[] }> }
    const entries = Array.isArray(typedBody?.entry) ? typedBody.entry : []
    const messagingEventCount = entries.reduce((count, entry) => {
      const events = Array.isArray(entry?.messaging) ? entry.messaging : []
      return count + events.length
    }, 0)

    console.log(
      '[META PAYLOAD] object=',
      typedBody?.object,
      'entry_count=',
      entries.length,
      'messaging_event_count=',
      messagingEventCount
    )
    const incoming = entries.flatMap((entry: { messaging?: unknown[] }) => {
      const messagingEvents = Array.isArray(entry?.messaging) ? entry.messaging : []

      return messagingEvents
        .map((event) => {
          const senderId = (event as { sender?: { id?: string } })?.sender?.id
          const message = (event as { message?: { text?: string; is_echo?: boolean } })?.message
          const text = message?.text
          const isEcho = Boolean(message?.is_echo)

          if (!senderId) {
            console.log('[SKIPPED] reason=missing_sender_id event=', JSON.stringify(event, null, 2))
            return null
          }

          if (!text) {
            console.log('[SKIPPED] reason=missing_text sender_id=', senderId)
            return null
          }

          if (isEcho) {
            console.log('[SKIPPED] reason=echo_message sender_id=', senderId, 'text=', text)
            return null
          }

          console.log('[MESSAGE FOUND] sender_id=', senderId, 'text=', text)
          return { senderId, text }
        })
        .filter((item): item is { senderId: string; text: string } => item !== null)
    })

    if (incoming.length === 0) {
      console.log('[SKIPPED] reason=no_processable_text_messages')
      return NextResponse.json({ status: 'ok', message: 'No text messages to process' })
    }

    const results = [] as Array<{
      senderId: string
      received: string
      aiStatus: 'ok' | 'failed'
      aiError?: string
      reply?: string
      sendStatus: 'sent' | 'failed'
      sendError?: string
    }>

    for (const msg of incoming) {
      const ai = await handleMessage({
        platform: 'instagram',
        user_id: msg.senderId,
        message: msg.text,
      })

      console.log(
        '[AI RESPONSE] sender_id=',
        msg.senderId,
        'success=',
        ai.success,
        'response=',
        ai.success ? ai.response : undefined,
        'error=',
        ai.success ? undefined : ai.error
      )

      if (!ai.success) {
        results.push({
          senderId: msg.senderId,
          received: msg.text,
          aiStatus: 'failed',
          aiError: ai.error,
          sendStatus: 'failed',
          sendError: 'Skipped because AI failed',
        })
        continue
      }

      const send = await sendMessage({
        recipient_id: msg.senderId,
        message_text: ai.response,
      })

      console.log(
        '[SEND RESULT] sender_id=',
        msg.senderId,
        'success=',
        send.success,
        'response=',
        send.success ? { messageId: send.messageId, raw: send.raw } : { status: send.status, raw: send.raw },
        'error=',
        send.success ? undefined : send.error
      )

      results.push({
        senderId: msg.senderId,
        received: msg.text,
        aiStatus: 'ok',
        reply: ai.response,
        sendStatus: send.success ? 'sent' : 'failed',
        sendError: send.success ? undefined : send.error,
      })
    }

    return NextResponse.json({ status: 'ok', processed: results.length, results })
  } catch (error) {
    console.error('[WEBHOOK ERROR]', error)
    return NextResponse.json(
      { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
