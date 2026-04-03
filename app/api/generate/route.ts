import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { isActiveSubscription } from "@/lib/supabase";

export const dynamic = "force-dynamic";

let _client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _client;
}
const FREE_LIMIT = 3;
const COOKIE_KEY = "keiyakusho_use_count";
const APP_ID = "keiyakusho-ai";

const rateLimit = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) { rateLimit.set(ip, { count: 1, resetAt: now + 60000 }); return true; }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

const systemPrompt = `あなたは企業法務・契約実務に精通した専門アドバイザーです。15年以上の実務経験を持ち、GVA assist・LegalForce等の競合ツールを超える品質の契約書レビューを提供します。
ユーザーは「今すぐ現場で使えるドキュメント・修正案」を求めています。

## 出力の絶対ルール

1. **即使えるコピペ文を必ず含める**
   - 修正後条文は「【修正後テキスト】」セクションとして出力する
   - 社名・氏名・日付は「（株式会社〇〇）」「（山田 太郎）」形式のプレースホルダーで示す
   - ユーザーが空欄を埋めるだけで使える完成度にする

2. **リスクの根拠を法的根拠で示す**
   - 該当する法律・条文を明示する（例: 民法第〇条、下請法第〇条）
   - 「リスクが高い」ではなく「〇〇法〇条に抵触する可能性があるため高リスク」と記述する

3. **3段階の選択肢を提示する**
   - 【A案: 自社有利修正】自社に最大限有利な条文
   - 【B案: バランス修正】実務上のバランスが最良。多くの場面で推奨
   - 【C案: 最小修正】相手への影響が最小限の修正

4. **深刻度を必ずスコアで示す**
   - 法的リスク: 低(1-3) / 中(4-6) / 高(7-9) / 重大(10) で数値化
   - 全体リスクスコアを冒頭に示す

5. **GVA assistとの差別化ポイント**
   - 修正後テキストを必ず出力する（GVAは指摘のみ）
   - 「この条項が有利な理由」も必ず説明する（自社有利/相手有利/中立 の判定）
   - 交渉推奨ポイントを優先順位付きで示す

最後に必ず「## 次の3ステップ」というセクションを追加し、ユーザーが今すぐ取れる具体的な行動を箇条書き（「- 」で始まる）3つ記載してください。例：「- 〇〇条を修正案Bで変更する」「- 相手方に〇〇を確認・交渉する」「- 重大リスクがある場合は弁護士に相談する」など、契約内容に応じた具体的な行動を書いてください。`;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "リクエストが多すぎます。しばらく待ってから再試行してください。" }, { status: 429 });
  }
  const email = req.cookies.get("user_email")?.value;
  let isPremium = false;
  if (email) {
    isPremium = await isActiveSubscription(email, APP_ID);
  } else {
    isPremium = req.cookies.get("premium")?.value === "1" || req.cookies.get("stripe_premium")?.value === "1";
  }
  const cookieCount = parseInt(req.cookies.get(COOKIE_KEY)?.value || "0");
  if (!isPremium && cookieCount >= FREE_LIMIT) {
    return NextResponse.json({ error: "LIMIT_REACHED" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 }); }

  const { contractText, checkMode, partyRole } = body as Record<string, string>;
  if (!contractText || !contractText.trim()) {
    return NextResponse.json({ error: "契約書のテキストを入力してください" }, { status: 400 });
  }
  if (contractText.length > 8000) {
    return NextResponse.json({ error: "契約書は8000文字以内で入力してください" }, { status: 400 });
  }

  const modeLabel = checkMode === "toitekihou" ? "取引適正化法（旧下請法）チェック" : "通常レビュー";
  const roleLabel = partyRole === "consignor" ? "委託者（発注側）" : "受託者（受注側）";
  const safeText = contractText.replace(/[<>]/g, "");

  const toitekihouGuide = checkMode === "toitekihou" ? `
## 取引適正化法（旧下請法）チェック 特別指示
2026年1月施行の取引適正化法に基づき、以下の違反類型を特にチェックすること:
- 代金の支払遅延・減額（取適法第4条1項）
- 不当な返品・やり直し強制（取適法第4条2項）
- 書面交付義務違反（取適法第3条）
- 禁止行為に該当する条文があれば「【取適法違反リスク】」として明記する
- 受発注の立場（${roleLabel}）から有利・不利を判定する
` : "";

  const prompt = `【契約書レビュー依頼】
チェックモード: ${modeLabel}
依頼者の立場: ${roleLabel}
${toitekihouGuide}
以下の契約書をレビューしてください。

【契約書テキスト】
${safeText}

---

以下の構造で出力してください（各セクションは「---」で区切ること）:

---
## 📊 総合評価

【全体リスクスコア】X/10

【最重要指摘事項（3点）】
1.
2.
3.

【${roleLabel}としての総合判断】
「締結を推奨します」「要修正後に締結」「締結を推奨しません」のいずれかを明示し、理由を2〜3文で。

---
## ⚠️ 問題条項一覧

問題のある条項を以下の形式で全て列挙:
### [条項番号または条項タイトル]
- **リスクレベル**: X/10
- **リスク内容**: （何が問題か・根拠法条文）
- **自社有利/相手有利/中立**:

---
## ⚖️ 有利不利分析（プレミアムプラン）

各条項の立場別有利不利を表形式で:
| 条項 | ${roleLabel}にとって | 相手方にとって | 推奨アクション |
|------|------|------|------|

---
## ✏️ 修正提案・コピペ用テンプレート

### 最優先修正条項の修正案

【A案: 自社有利修正】
（そのまま差し替え可能な条文テキスト）

【B案: バランス修正（推奨）】
（そのまま差し替え可能な条文テキスト）

【C案: 最小修正】
（そのまま差し替え可能な条文テキスト）

### 交渉推奨ポイント（優先度順）
1.
2.
3.

---
※ 本ツールが生成するレビュー結果はAIによる参考案です。法的効力を持つものではありません。重要な契約の締結前には必ず弁護士にご相談ください。`;

  try {
    const newCount = cookieCount + 1;
    const stream = getClient().messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
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
          const meta = JSON.stringify({ count: newCount });
          controller.enqueue(encoder.encode(`\nDONE:${meta}`));
          controller.close();
        } catch (err) {
          console.error(err);
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        "Set-Cookie": `${COOKIE_KEY}=${newCount}; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax; HttpOnly; Secure; Path=/`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI生成中にエラーが発生しました。しばらく待ってから再試行してください。" }, { status: 500 });
  }
}
