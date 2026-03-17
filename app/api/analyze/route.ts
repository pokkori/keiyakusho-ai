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
  const { contractText, checkMode, partyRole } = await req.json();
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

  const charLimit = isPremium ? 20000 : 8000;
  const isTruncated = contractText.length > charLimit;
  const premiumSection = isPremium ? `
---

## 有利不利
この契約書について：
【あなたに有利な点】
【あなたに不利な点】
【交渉すべきポイント】
` : "";

  const isToitekihou = checkMode === "toitekihou";
  const partyRoleText = partyRole === "consignor" ? "委託者（発注側）" : partyRole === "consignee" ? "受託者（受注側）" : "不明";

  const toitekihouSection = isToitekihou ? `

---

## 取適法チェック（取引適正化法 2026年1月施行）
2026年1月1日施行の取引適正化法（旧下請法）に基づき、以下の観点でチェックしてください。
依頼者の立場: ${partyRoleText}

チェック観点：
1. 代金の支払い条件（60日以内の支払義務等）に問題がないか
2. 不当な代金減額・返品・買いたたきの禁止に反する条項がないか
3. 発注書面交付義務への準拠
4. 給付の受領拒否の禁止に反する条項がないか
5. 購入・利用強制の禁止に反する条項がないか
6. 報復措置の禁止に反する条項がないか

違反リスクがある場合は条文番号・文言を明示し、${partyRoleText}の立場からのリスクを具体的に説明してください。
問題がない場合は「取適法上の違反リスクは検出されませんでした」と明記してください。
` : "";

  const basePrompt = isToitekihou
    ? `あなたは企業法務・契約審査を20年以上担当してきた元大手法律事務所パートナー弁護士です。取引適正化法（旧下請法・2026年1月施行）を含む最新の法令に精通し、1,000件以上の契約書レビューを手がけた実績を持ちます。依頼者の立場（${partyRoleText}）に立った実践的なレビューを提供してください。`
    : `あなたは企業法務・契約審査を20年以上担当してきた元大手法律事務所パートナー弁護士です。民法・商法・労働法・知財法・個人情報保護法を熟知し、1,000件以上の契約書レビューを手がけた実績を持ちます。依頼者の立場に立った実践的かつ使えるレビューを提供してください。`;

  const prompt = `${basePrompt}

以下の契約書を詳細にレビューしてください。

【重要な品質基準】
- 抽象的・曖昧な指摘（「リスクがあります」だけ）は禁止。必ず「なぜリスクか」「具体的にどんな被害が想定されるか」を明記
- 修正提案はそのままコピーして使えるレベルの文章で提示（「○○に変更推奨」ではなく実際の条文案を書くこと）
- 業界慣行・判例との比較で「この条項は業界標準より厳しい/緩い」を明示
- リスク評価には「最悪シナリオ（損害額・法的責任の最大値）」を具体的に示すこと

---

## 総合評価
契約書全体のリスクレベルをA（低リスク）〜E（高リスク）で評価してください。

**リスクレベル：[ ]**

主な問題点（上位3件）：
1.
2.
3.

最悪シナリオ（このまま締結した場合に起こりうる最大の損害・リスク）：

---

## 問題条項（詳細）
リスクのある条項・不利な条項を、リスクの高い順に指摘してください。各条項について以下を必ず記載：

### [条項番号・タイトル] — リスク度：★★★（高）/ ★★（中）/ ★（低）

**該当箇所の文言：**
（原文を引用）

**問題の内容：**
（具体的に何がなぜ問題なのかを説明）

**想定される最悪シナリオ：**
（この条項が悪用・問題化した場合の具体的な損害・状況）

**業界標準との比較：**
（一般的な契約書と比べて有利か不利か）
${premiumSection}${toitekihouSection}
---

## 修正提案（コピー&ペースト用）
問題条項ごとに、すぐに使える修正文案を提示してください。

### [条項番号] 修正前 → 修正後
**修正前：**
（原文）

**修正後（推奨案）：**
（そのまま使える修正文案を日本語で）

**修正理由：**（1〜2文で）

---

## 交渉戦略アドバイス
相手方との交渉で使える具体的な言い回しと優先交渉項目を3点以内で提示してください。

---

契約書の内容：
${contractText.slice(0, charLimit)}`;

  try {
    const warning = isTruncated ? `※ ${charLimit.toLocaleString()}文字を超えた部分は分析対象外となります` : undefined;
    const stream = getClient().messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 5000,
      messages: [{ role: "user", content: prompt }],
    });
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
          controller.enqueue(encoder.encode(`\nDONE:${JSON.stringify({ count, ...(warning ? { warning } : {}) })}`));
          controller.close();
        } catch (err) { console.error(err); controller.error(err); }
      },
    });
    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return NextResponse.json({ error: "AI処理中にエラーが発生しました" }, { status: 500 });
  }
}
