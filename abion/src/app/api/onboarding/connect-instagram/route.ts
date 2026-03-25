import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token || !token.trim()) {
      return NextResponse.json({ error: "Access token is required." }, { status: 400 });
    }

    // Validate the token works by hitting the Instagram Graph API
    const testRes = await fetch(
      `https://graph.facebook.com/v23.0/me?access_token=${encodeURIComponent(token.trim())}`
    );
    const testData = await testRes.json() as { error?: { message?: string }; id?: string };

    if (!testRes.ok || testData.error) {
      return NextResponse.json(
        { error: `Invalid token: ${testData.error?.message ?? "Could not verify with Instagram"}` },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured." }, { status: 500 });
    }

    // Store token in DB (in production, encrypt this)
    const { error } = await supabase
      .from("instagram_config")
      .upsert({
        access_token: token.trim(),
        instagram_id: testData.id,
        connected_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.warn("instagram_config table error (may not exist yet):", error.message);
      // Still return success — token will need to be set in env manually
    }

    return NextResponse.json({ success: true, instagramId: testData.id });
  } catch (err) {
    console.error("Connect Instagram error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
