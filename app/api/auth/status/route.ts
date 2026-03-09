import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const APP_ID = "keiyakusho";

export async function GET(req: NextRequest) {
  const email = req.cookies.get("user_email")?.value;
  const legacyCookie = req.cookies.get("stripe_premium")?.value;

  if (!email) {
    return NextResponse.json({
      premium: legacyCookie === "1",
      email: null,
      remaining: null,
    });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("subscriptions")
      .select("status, current_period_end, plan")
      .eq("email", email)
      .eq("app_id", APP_ID)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!data || data.status !== "active") {
      return NextResponse.json({ premium: false, email, remaining: null });
    }

    let premium = true;
    let remaining: string | null = null;
    if (data.current_period_end) {
      const end = new Date(data.current_period_end);
      premium = end > new Date();
      remaining = end.toISOString();
    }

    return NextResponse.json({ premium, email, remaining, plan: data.plan });
  } catch {
    return NextResponse.json({ premium: legacyCookie === "1", email, remaining: null });
  }
}
