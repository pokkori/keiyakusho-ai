import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const APP_ID = "keiyakusho";

export async function GET(req: NextRequest) {
  const email = req.cookies.get("user_email")?.value;
  const legacyCookie = req.cookies.get("stripe_premium")?.value;

  // PAY.JPサブスク購入後のpremium cookie (sub_xxx) チェック
  const premiumCookie = req.cookies.get("premium")?.value;
  const oneTimeCookie = req.cookies.get("one_time_premium")?.value;
  if (premiumCookie || oneTimeCookie) {
    try {
      const supabase = getSupabaseAdmin();
      const cookieKey = premiumCookie ? `sub:${premiumCookie}` : `charge:${oneTimeCookie}`;
      const { data: subData } = await supabase
        .from("usage_counts")
        .select("updated_at")
        .eq("key", cookieKey)
        .single();
      if (subData && new Date(subData.updated_at) > new Date()) {
        return NextResponse.json({ premium: true, email: email ?? null, remaining: subData.updated_at });
      }
    } catch { /* fallthrough */ }
  }

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
