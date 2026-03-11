import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PAYJP_API = "https://api.pay.jp/v1";
const ONE_TIME_AMOUNT = 980;

function auth() {
  return "Basic " + Buffer.from(process.env.PAYJP_SECRET_KEY! + ":").toString("base64");
}

async function payjpPost(path: string, body: Record<string, string>) {
  const res = await fetch(`${PAYJP_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: auth(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body).toString(),
  });
  return res.json();
}

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: "No token" }, { status: 400 });

  try {
    // PAY.JP chargesで単発課金
    const charge = await payjpPost("/charges", {
      card: token,
      amount: String(ONE_TIME_AMOUNT),
      currency: "jpy",
      description: "契約書AIレビュー 1回払い",
    });
    if (charge.error) {
      return NextResponse.json({ error: charge.error.message }, { status: 400 });
    }

    // 30日間有効なone-time_premiumクッキーを設定
    const res = NextResponse.json({ ok: true });
    res.cookies.set("one_time_premium", "1", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "決済処理に失敗しました" }, { status: 500 });
  }
}
