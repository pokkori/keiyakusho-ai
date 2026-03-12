"use client";
import { useState } from "react";
import Link from "next/link";
import PayjpModal from "@/components/PayjpModal";

export default function Home() {
  const [showPayjpSub, setShowPayjpSub] = useState(false);
  const [showPayjpOnce, setShowPayjpOnce] = useState(false);

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      {showPayjpOnce && (
        <PayjpModal
          publicKey={process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY!}
          planLabel="1回払い ¥980 — 30日間有効（契約書レビュー何回でも使用可）"
          apiPath="/api/payjp/charge"
          onSuccess={() => { setShowPayjpOnce(false); window.location.href = "/tool"; }}
          onClose={() => setShowPayjpOnce(false)}
        />
      )}
      {showPayjpSub && (
        <PayjpModal
          publicKey={process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY!}
          planLabel="プレミアム ¥2,980/月 — 無制限"
          onSuccess={() => { setShowPayjpSub(false); window.location.href = "/tool"; }}
          onClose={() => setShowPayjpSub(false)}
        />
      )}
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-block bg-indigo-600 text-white text-sm font-bold px-4 py-1 rounded-full mb-6">
          AI × 契約書レビュー
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
          契約書の落とし穴、<br />
          <span className="text-indigo-400">AIが即チェック</span>
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          弁護士に頼む前に、AIで契約書のリスク箇所・不利な条項・修正提案を数秒で確認。
          フリーランス・中小企業の方に最適です。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/tool"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all"
          >
            無料で試す（3回）
          </Link>
          <button
            onClick={() => setShowPayjpOnce(true)}
            className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-bold py-4 px-8 rounded-xl text-lg transition-all"
          >
            今すぐ1回試す ¥980
          </button>
          <button
            onClick={() => setShowPayjpSub(true)}
            className="bg-white text-slate-900 hover:bg-slate-100 font-bold py-4 px-8 rounded-xl text-lg transition-all"
          >
            ¥2,980/月で無制限に使う
          </button>
        </div>
        <p className="text-slate-400 text-sm">クレジットカード不要で3回無料 • 1回払い¥980 • いつでもキャンセル可能</p>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-black text-center mb-12">こんな時に使えます</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "📋",
              title: "業務委託契約",
              desc: "報酬未払い・著作権譲渡・競業禁止など、フリーランスが見落としやすいリスクを検出",
            },
            {
              icon: "🏢",
              title: "賃貸・不動産契約",
              desc: "敷金返還・原状回復・途中解約の条件など、後でもめやすい条項をチェック",
            },
            {
              icon: "🤝",
              title: "業務提携・NDA",
              desc: "秘密保持の範囲・損害賠償・契約期間など、ビジネス契約のリスクを分析",
            },
          ].map((f) => (
            <div key={f.title} className="bg-slate-800 rounded-2xl p-6">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-slate-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Results Tabs Preview */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-black text-center mb-4">4つの視点で分析</h2>
        <p className="text-slate-400 text-center mb-10">契約書を貼り付けるだけで、4タブの詳細レポートを生成</p>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { tab: "総合評価", desc: "契約書全体のリスクレベルをA〜Eで評価。何が問題か一目でわかる" },
            { tab: "問題条項", desc: "不利・危険な条項を赤色でハイライト。場所と理由を具体的に説明" },
            { tab: "有利不利", desc: "あなた側にとって有利な点・不利な点を整理。交渉ポイントが明確に" },
            { tab: "修正提案", desc: "問題条項の具体的な修正文案を提示。コピーしてそのまま使える" },
          ].map((t) => (
            <div key={t.tab} className="bg-slate-800 border border-indigo-500/30 rounded-xl p-5">
              <div className="inline-block bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                {t.tab}
              </div>
              <p className="text-slate-300">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-black mb-12">料金プラン</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* 無料プラン */}
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
            <h3 className="text-xl font-bold mb-2">無料プラン</h3>
            <div className="text-4xl font-black mb-4">¥0</div>
            <ul className="text-slate-300 space-y-2 mb-6 text-left">
              <li>✓ 3回まで無料</li>
              <li>✓ 総合評価・問題条項・修正提案</li>
              <li>✗ 回数制限あり</li>
            </ul>
            <Link href="/tool" className="block bg-slate-700 hover:bg-slate-600 font-bold py-3 px-6 rounded-xl transition-all">
              無料で試す
            </Link>
          </div>
          {/* 1回払いプラン */}
          <div className="bg-yellow-400 rounded-2xl p-8 border border-yellow-300 text-slate-900 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-yellow-400 text-xs font-black px-3 py-1 rounded-full whitespace-nowrap">入口プラン</div>
            <h3 className="text-xl font-bold mb-2">1回払い</h3>
            <div className="text-4xl font-black mb-1">¥980</div>
            <div className="text-sm font-medium mb-4 text-slate-700">30日間有効</div>
            <ul className="space-y-2 mb-6 text-left text-slate-800">
              <li>✓ 30日間使い放題</li>
              <li>✓ 総合評価・問題条項・修正提案</li>
              <li>✓ 月額不要・都度払い</li>
              <li>✗ 有利不利タブはPremium限定</li>
            </ul>
            <button
              onClick={() => setShowPayjpOnce(true)}
              className="w-full bg-slate-900 text-yellow-400 hover:bg-slate-800 font-bold py-3 px-6 rounded-xl transition-all"
            >
              今すぐ1回試す ¥980
            </button>
          </div>
          {/* プレミアムプラン */}
          <div className="bg-indigo-600 rounded-2xl p-8 border border-indigo-400">
            <div className="inline-block bg-white text-indigo-600 text-xs font-black px-3 py-1 rounded-full mb-3">おすすめ</div>
            <h3 className="text-xl font-bold mb-2">プレミアム</h3>
            <div className="text-4xl font-black mb-4">¥2,980<span className="text-lg font-normal">/月</span></div>
            <ul className="space-y-2 mb-6 text-left">
              <li>✓ 無制限に使える</li>
              <li>✓ 4タブ詳細分析（有利不利含む）</li>
              <li>✓ いつでもキャンセル</li>
            </ul>
            <button
              onClick={() => setShowPayjpSub(true)}
              className="w-full bg-white text-indigo-600 hover:bg-slate-100 font-bold py-3 px-6 rounded-xl transition-all"
            >
              今すぐ始める
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="/legal" className="hover:text-white">特定商取引法</Link>
          <Link href="/privacy" className="hover:text-white">プライバシーポリシー</Link>
          <Link href="/terms" className="hover:text-white">利用規約</Link>
        </div>
        <p>© 2025 契約書AIレビュー</p>
      </footer>
    </main>
  );
}
