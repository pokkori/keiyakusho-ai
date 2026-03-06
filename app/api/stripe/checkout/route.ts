import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

const PRICES: Record<string, string> = {
  standard: process.env.STRIPE_PRICE_STD!,
  business: process.env.STRIPE_PRICE_BIZ!,
};

async function createSession(plan: string, origin: string) {
  const priceId = PRICES[plan];
  if (!priceId) return null;
  return getStripe().checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/#pricing`,
    locale: "ja",
  });
}

export async function GET(req: NextRequest) {
  const plan = req.nextUrl.searchParams.get("plan") ?? "";
  const origin = req.headers.get("referer")?.replace(/\/[^/]*$/, "") || "https://hojyokin-ai-delta.vercel.app";
  const session = await createSession(plan, origin);
  if (!session) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  return NextResponse.redirect(session.url!);
}

export async function POST(req: NextRequest) {
  const { plan } = await req.json();
  const origin = req.headers.get("origin") || "https://hojyokin-ai-delta.vercel.app";
  const session = await createSession(plan, origin);
  if (!session) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  return NextResponse.json({ url: session.url });
}
