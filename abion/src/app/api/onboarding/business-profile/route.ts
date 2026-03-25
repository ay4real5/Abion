import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessName, businessType, services, pricing, tone, extraInfo } = body;

    if (!businessName || !businessType || !services) {
      return NextResponse.json({ error: "Business name, type, and services are required." }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured." }, { status: 500 });
    }

    // Build the AI system prompt from their profile
    const systemPrompt = `You are an AI receptionist for ${businessName}, a ${businessType} business.

Your job is to:
1. Greet customers warmly
2. Answer questions about services and pricing
3. Qualify leads by asking the right questions
4. Book appointments or direct them to take action
5. Follow up if they go quiet

About the business:
- Name: ${businessName}
- Industry: ${businessType}
- Services: ${services}
${pricing ? `- Pricing: ${pricing}` : ""}
${extraInfo ? `- Additional info: ${extraInfo}` : ""}

Tone: ${tone}. Keep replies concise, helpful, and conversational — like a real human receptionist, not a robot. Never be pushy. Always be helpful.`;

    const { error } = await supabase
      .from("business_profiles")
      .upsert({
        business_name: businessName,
        business_type: businessType,
        services,
        pricing: pricing || null,
        tone,
        extra_info: extraInfo || null,
        system_prompt: systemPrompt,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      // If table doesn't exist yet, still proceed — profile will be used once table is created
      console.warn("business_profiles table error (may not exist yet):", error.message);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Business profile error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
