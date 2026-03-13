import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const APP_ID = "keiyakusho";
const FREE_LIMIT = 3;

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
}

export async function POST(req: NextRequest) {
  const { contractText } = await req.json();
  if (!contractText?.trim()) {
    return NextResponse.json({ error: "契約書の内容を入力してください" }, { status: 400 });
  }

  const email = req.cookies.get("user_email")?.value;
  let isPremium = false;

  if (email) {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("subscriptions")
      .select("status, current_period_end")
      .eq("email", email)
      .eq("app_id", APP_ID)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    if (data?.status === "active") {
      if (data.current_period_end) {
        isPremium = new Date(data.current_period_end) > new Date();
      } else {
        isPremium = true;
      }
    }
  }

  const supabase = getSupabaseAdmin();
  if (!isPremium) {
    const cookiePremium = req.cookies.get("premium")?.value;
    // subscription IDをSupabaseで検証（"1"等の手動設定を拒否）
    if (cookiePremium?.startsWith("sub_")) {
      const { data: subData } = await supabase
        .from("usage_counts")
        .select("updated_at")
        .eq("key", `sub:${cookiePremium}`)
        .single();
      if (subData && new Date(subData.updated_at) > new Date()) isPremium = true;
    }
  }
  if (!isPremium) {
    const oneTimePremium = req.cookies.get("one_time_premium")?.value;
    // charge IDをSupabaseで検証（"1"等の手動設定を拒否）
    if (oneTimePremium?.startsWith("ch_")) {
      const { data: chargeData } = await supabase
        .from("usage_counts")
        .select("updated_at")
        .eq("key", `charge:${oneTimePremium}`)
        .single();
      if (chargeData && new Date(chargeData.updated_at) > new Date()) {
        isPremium = true;
      }
    }
  }
  let count = 0;
  if (!isPremium) {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const key = `keiyakusho:${ip}`;
    const { data: usageData } = await supabase
      .from("usage_counts")
      .select("count")
      .eq("key", key)
      .single();
    count = usageData?.count ?? 0;
    if (count >= FREE_LIMIT) {
      return NextResponse.json({ error: "Free limit reached" }, { status: 429 });
    }
    await supabase.from("usage_counts").upsert(
      { key, count: count + 1, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );
    count = count + 1;
  }

  const isTruncated = contractText.length > 8000;
  const premiumSection = isPremium ? `
---

## 有利不利
この契約書について：
【あなたに有利な点】
【あなたに不利な点】
【交渉すべきポイント】
` : "";

  const prompt = `あなたは契約書レビューの専門家です。以下の契約書を詳細にレビューしてください。

## 総合評価
契約書全体のリスクレベルをA（低リスク）〜E（高リスク）で評価し、主な問題点を3点以内で要約してください。

---

## 問題条項
リスクのある条項・不利な条項を具体的に指摘してください。各条項について：
- 該当箇所（条文番号や文言）
- 問題の内容
- なぜリスクなのか
${premiumSection}
---

## 修正提案
問題条項の具体的な修正文案を提示してください。コピーしてそのまま使えるレベルで書いてください。

---

契約書の内容：
${contractText.slice(0, 8000)}`;

  try {
    const client = getClient();
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 3000,
      messages: [{ role: "user", content: prompt }],
    });
    const result = message.content[0].type === "text" ? message.content[0].text : "";
    const warning = isTruncated ? "※ 8,000文字を超えた部分は分析対象外となります" : undefined;
    return NextResponse.json({ result, count, ...(warning ? { warning } : {}) });
  } catch {
    return NextResponse.json({ error: "AI処理中にエラーが発生しました" }, { status: 500 });
  }
}
