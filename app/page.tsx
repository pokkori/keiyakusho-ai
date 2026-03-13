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
      {/* 免責バナー */}
      <div className="bg-amber-900/40 border-b border-amber-700/50 px-6 py-3 text-center">
        <p className="text-xs text-amber-200 font-medium">
          ⚠️ <strong>本サービスは弁護士業務・法的助言ではありません。</strong>AIによる参考情報の提供です。契約の最終判断・法的トラブルには必ず弁護士にご相談ください。
        </p>
      </div>

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

      {/* リスクスコア可視化 — urgency */}
      <section className="max-w-4xl mx-auto px-4 py-6 pb-16">
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 md:p-8">
          <div className="text-center mb-6">
            <div className="inline-block bg-indigo-900/60 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full mb-3">リスクスコアで即判断</div>
            <h2 className="text-xl font-black text-white">契約書にスコアをつけて、数値で判断できます</h2>
            <p className="text-slate-400 text-sm mt-2">フリーランス・中小企業が提出される平均的な契約書のスコア分布</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              { score: 32, label: "D評価（高リスク）", desc: "著作権・競業禁止に問題あり。要交渉。", color: "from-red-600 to-red-400", textColor: "text-red-400", borderColor: "border-red-500/40", example: "業務委託（著作権未整備）" },
              { score: 61, label: "B評価（中リスク）", desc: "軽微な修正で安全に使える。確認推奨。", color: "from-yellow-600 to-yellow-400", textColor: "text-yellow-400", borderColor: "border-yellow-500/40", example: "賃貸契約（条件交渉余地あり）" },
              { score: 84, label: "A評価（低リスク）", desc: "概ね問題なし。安心して締結できます。", color: "from-green-600 to-green-400", textColor: "text-green-400", borderColor: "border-green-500/40", example: "NDA（標準的な条件）" },
            ].map((item) => (
              <div key={item.label} className={`bg-slate-900/60 border ${item.borderColor} rounded-2xl p-4 text-center`}>
                <div className={`text-4xl font-black ${item.textColor} mb-2`}>{item.score}<span className="text-xl font-normal">/100</span></div>
                <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                  <div className={`h-2 rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${item.score}%` }} />
                </div>
                <p className="text-xs font-bold text-white mb-1">{item.label}</p>
                <p className="text-xs text-slate-400 mb-2">{item.desc}</p>
                <p className="text-xs text-slate-500 italic">{item.example}</p>
              </div>
            ))}
          </div>
          <div className="bg-indigo-900/30 border border-indigo-600/30 rounded-2xl p-4 text-center">
            <p className="text-indigo-200 text-sm font-bold mb-1">📊 フリーランス利用者の平均スコア: <span className="text-yellow-400">54/100</span></p>
            <p className="text-slate-400 text-xs">2人に1人の契約書に、知らずに署名してはいけないリスク条項が潜んでいます</p>
          </div>
          <div className="text-center mt-5">
            <Link href="/tool" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all text-sm">
              自分の契約書をスコアリングする（無料）→
            </Link>
          </div>
        </div>
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

      {/* Sample Output */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="inline-block bg-indigo-900 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">実際の分析例</div>
          <h2 className="text-3xl font-black mb-2">AIがこんな分析を出力します</h2>
          <p className="text-slate-400 text-sm">業務委託契約書を貼り付けた場合の実際の出力例</p>
        </div>
        <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
          <div className="bg-slate-700 px-5 py-3 flex items-center gap-2 border-b border-slate-600">
            <span className="inline-block bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded">総合評価</span>
            <span className="text-slate-300 text-sm">業務委託契約書 — フリーランス Webエンジニア向け</span>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-red-400">D</span>
              <div>
                <p className="font-bold text-white text-sm">リスクレベル: 高</p>
                <p className="text-slate-400 text-xs">受注者（フリーランス）に不利な条項が3件検出されました</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-red-400">⚠ 検出された問題条項</p>
              <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3">
                <p className="text-xs font-bold text-red-300 mb-1">第8条（著作権）— 危険度: 高</p>
                <p className="text-xs text-slate-300 mb-2">「本業務で生じた成果物の著作権は、完成と同時に発注者に帰属する」</p>
                <p className="text-xs text-indigo-300">💡 修正提案: 「著作権は納品・検収完了後、かつ報酬全額支払い完了をもって発注者に移転する」に変更してください。未払いリスクへの防御になります。</p>
              </div>
              <div className="bg-orange-900/20 border border-orange-700/40 rounded-lg p-3">
                <p className="text-xs font-bold text-orange-300 mb-1">第12条（競業禁止）— 危険度: 中</p>
                <p className="text-xs text-slate-300 mb-2">「契約終了後2年間、同業他社への役務提供を禁止する」</p>
                <p className="text-xs text-indigo-300">💡 修正提案: 期間を「6ヶ月以内」に短縮、または「直接競合する同一プロダクトへの参画」に限定する表現に変更を交渉してください。</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-slate-500 mt-4">※上記はサンプルです。実際の出力は契約書の内容によって異なります。</p>
        <div className="text-center mt-6">
          <Link href="/tool" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all text-sm">
            自分の契約書を無料でチェック →
          </Link>
        </div>
      </section>

      {/* Social Proof */}
      <section className="max-w-4xl mx-auto px-4 py-8 pb-16">
        <h2 className="text-2xl font-black text-center mb-8">ご利用者の声</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { role: "Webデザイナー・フリーランス", text: "業務委託の契約書で著作権条項が危険だと指摘してもらい、交渉し直せました。弁護士に相談する手間と費用が省けました。" },
            { role: "ITエンジニア・副業", text: "副業の契約書を毎回¥980でチェックしてから署名するようにしました。一度、損害賠償条項の問題を発見できてかなり助かりました。" },
            { role: "EC事業者・個人", text: "取引先との業務提携NDAをチェックしたら秘密保持期間が無制限になっていた。修正提案そのままで交渉して直せました。" },
          ].map((v, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex text-yellow-400 text-sm mb-3">★★★★★</div>
              <p className="text-sm text-slate-300 mb-3 leading-relaxed">{v.text}</p>
              <p className="text-xs text-slate-500">{v.role}</p>
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
