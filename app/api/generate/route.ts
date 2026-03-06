import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const FREE_LIMIT = 3;
const COOKIE_KEY = "hojyokin_use_count";

const rateLimit = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) { rateLimit.set(ip, { count: 1, resetAt: now + 60000 }); return true; }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "リクエストが多すぎます。しばらく待ってから再試行してください。" }, { status: 429 });
  }
  const cookieCount = parseInt(req.cookies.get(COOKIE_KEY)?.value || "0");
  if (cookieCount >= FREE_LIMIT) {
    return NextResponse.json({ error: "LIMIT_REACHED" }, { status: 429 });
  }
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 }); }

  const { businessType, employees, purpose, prefecture, isIndividual } = body as Record<string, string>;
  if (!purpose) return NextResponse.json({ error: "活用目的は必須です" }, { status: 400 });

  const prompt = `あなたは補助金・助成金の専門コンサルタントです。以下の情報をもとに、申請可能な補助金を診断し、申請書のドラフトを作成してください。

事業形態: ${isIndividual ? "個人" : "法人・個人事業主"}
業種: ${businessType || "未入力"}
従業員数: ${employees || "0"}名
都道府県: ${prefecture || "未入力"}
活用目的・やりたいこと: ${purpose}

以下の構成で回答してください：

## 🎯 申請可能な補助金・助成金（上位3つ）

### 1位: [補助金名]
- 補助上限額:
- 補助率:
- 申請期間:
- あなたが申請できる理由:

### 2位: [補助金名]
- 補助上限額:
- 補助率:
- 申請期間:
- あなたが申請できる理由:

### 3位: [補助金名]
- 補助上限額:
- 補助率:
- 申請期間:
- あなたが申請できる理由:

## 📝 申請書ドラフト（1位の補助金向け）

### 事業計画の概要
（200文字程度）

### 補助事業の必要性
（200文字程度）

### 期待される効果
（200文字程度）

## ⚠️ 注意事項
（申請前に確認すべきポイント）

※本情報は参考情報です。実際の申請前に公募要領を必ずご確認ください。`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });
    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const newCount = cookieCount + 1;
    const res = NextResponse.json({ result: text, count: newCount });
    res.cookies.set(COOKIE_KEY, String(newCount), { maxAge: 60 * 60 * 24 * 30, sameSite: "lax" });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI生成中にエラーが発生しました。しばらく待ってから再試行してください。" }, { status: 500 });
  }
}
