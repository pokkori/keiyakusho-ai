import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { isActiveSubscription } from "@/lib/supabase";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}
const FREE_LIMIT = 3;
const COOKIE_KEY = "hojyokin_use_count";
const APP_ID = "hojyokin";

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

  const { businessType, employees, purpose, prefecture, isIndividual } = body as Record<string, string>;
  if (!purpose) return NextResponse.json({ error: "活用目的は必須です" }, { status: 400 });
  if (purpose.length > 1000) return NextResponse.json({ error: "活用目的は1000文字以内で入力してください" }, { status: 400 });

  const prompt = `あなたは補助金・助成金の専門コンサルタントです。10年以上の実績を持ち、採択率向上のノウハウを熟知しています。以下の情報をもとに、申請可能な補助金の診断と採択を見据えた申請書ドラフトを作成してください。

【依頼者情報】
事業形態: ${isIndividual ? "個人（一般）" : "法人・個人事業主"}
業種: ${businessType || "未入力"}
従業員数: ${employees || "0"}名
所在地: ${prefecture || "未入力"}
活用目的・やりたいこと: ${purpose}

以下の構成で詳細に回答してください：

---

## 🎯 申請可能な補助金・助成金（優先度順 上位5件）

### ◆ 第1位: [補助金名]
- **補助上限額**:
- **補助率**:
- **申請期間**: （次回公募の想定時期）
- **主管省庁**:
- **採択率（直近）**:
- **あなたが選ばれる理由**: （具体的に3点）
- **注意すべき要件**:

### ◆ 第2位: [補助金名]
- **補助上限額**:
- **補助率**:
- **申請期間**:
- **主管省庁**:
- **採択率（直近）**:
- **あなたが選ばれる理由**: （具体的に3点）
- **注意すべき要件**:

### ◆ 第3位: [補助金名]
- **補助上限額**:
- **補助率**:
- **申請期間**:
- **主管省庁**:
- **あなたが選ばれる理由**: （具体的に2点）

### ◆ 第4位・第5位（簡易）
- [補助金名]: 補助上限額・補助率・一言コメント
- [補助金名]: 補助上限額・補助率・一言コメント

---

## 📝 申請書ドラフト（第1位の補助金向け・提出ベース）

### 【1】事業計画の概要
（事業の目的・背景・現状の課題を具体的に記述。300文字程度）

### 【2】補助事業の必要性・緊急性
（なぜ今この補助金が必要か、補助なしではどう困るかを論理的に記述。300文字程度）

### 【3】事業の具体的な実施内容
（何を購入・導入・実施するか、どんな手順で進めるかを具体的に記述。300文字程度）

### 【4】期待される効果と数値目標
（売上・生産性・コスト削減など数値で示せる目標を含めて記述。300文字程度）

### 【5】補助事業後の展開・持続可能性
（補助金終了後も事業が継続・発展できる根拠を記述。200文字程度）

---

## ✅ 申請要件チェックリスト（第1位）

以下の項目を申請前に確認してください：
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]

---

## 📈 採択率を上げる3つのポイント

1.
2.
3.

---

## ⚠️ よくある落選理由と対策

| 落選理由 | 対策 |
|---------|------|
|  |  |
|  |  |
|  |  |

---

※本情報は参考情報です。補助金の内容は変更される場合があります。実際の申請前に必ず公募要領・所管省庁の最新情報をご確認ください。`;

  try {
    const message = await getClient().messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });
    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const newCount = cookieCount + 1;
    const res = NextResponse.json({ result: text, count: newCount });
    res.cookies.set(COOKIE_KEY, String(newCount), { maxAge: 60 * 60 * 24 * 30, sameSite: "lax", httpOnly: true, secure: true });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI生成中にエラーが発生しました。しばらく待ってから再試行してください。" }, { status: 500 });
  }
}
