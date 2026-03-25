/**
 * Unified message handler — all platforms (widget, whatsapp, instagram) use this.
 * Same AI logic, same DB schema, single source of truth.
 */

import OpenAI from 'openai';
import { getSupabaseAdminClient } from './supabase';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const DEFAULT_SYSTEM_PROMPT =
  'You are a helpful AI receptionist for a business. Reply professionally, concisely, and warmly. Help customers with their enquiries and qualify leads.';

// Cache business profile system prompt for 5 min
let _cachedPrompt: string | null = null;
let _promptExpiry = 0;

async function getSystemPrompt(): Promise<string> {
  if (_cachedPrompt && Date.now() < _promptExpiry) return _cachedPrompt;

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const { data } = await supabase
      .from('business_profiles')
      .select('system_prompt')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data?.system_prompt) {
      _cachedPrompt = data.system_prompt as string;
      _promptExpiry = Date.now() + 5 * 60 * 1000;
      return _cachedPrompt;
    }
  }

  return DEFAULT_SYSTEM_PROMPT;
}

export type Platform = 'widget' | 'instagram' | 'whatsapp';

export type HandleMessageInput = {
  platform: Platform;
  user_id: string;       // sender ID (session ID for widget, phone for whatsapp, IG sender ID)
  message: string;
};

export type HandleMessageResult = {
  success: true;
  response: string;
} | {
  success: false;
  error: string;
};

export async function handleMessage(input: HandleMessageInput): Promise<HandleMessageResult> {
  const { platform, user_id, message } = input;

  if (!message?.trim()) {
    return { success: false, error: 'Message is empty.' };
  }

  try {
    const systemPrompt = await getSystemPrompt();

    // Generate AI reply
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
    });

    const response = completion.choices[0]?.message?.content ?? 'No response generated.';

    // Save to database
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { error: dbError } = await supabase.from('conversations').insert({
        platform,
        sender_id: user_id,
        message,
        ai_response: response,
      });

      if (dbError) {
        console.error(`[${platform}] DB save failed:`, dbError.message);
      }
    }

    return { success: true, response };
  } catch (err) {
    console.error(`[${platform}] handleMessage error:`, err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
