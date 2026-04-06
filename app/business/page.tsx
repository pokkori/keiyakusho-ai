"use client";

import Link from "next/link";
import { useState } from "react";

const PURPOSES_KEIYAKU = ["フリーランス・業務委託契約のリスク確認", "社内の外注・パートナー契約管理", "SaaS利用規約の確認", "士業事務所での顧客サポートに活用", "その他"];

function DemoForm({ accentColor, serviceName, purposes }: { accentColor: string; serviceName: string; purposes: string[] }) {
  const [form, setForm] = useState({ company: "", name: "", email: "", phone: "", purpose: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`${serviceName} 無料デモのお申込み`);
    const body = encodeURIComponent(
      `会社名: ${form.company}\n担当者名: ${form.name}\nメール: ${form.email}\n電話番号: ${form.phone}\nご利用目的: ${form.purpose}`
    );
    window.open(`mailto:support@pokkorilab.com?subject=${subject}&body=${body}`, "_blank");
    setSubmitted(true);
  }

  const ring = accentColor === "indigo" ? "focus:border-indigo-400" : "focus:border-blue-400";
  const btn = accentColor === "indigo" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-blue-600 hover:bg-blue-700";
  const badge = accentColor === "indigo" ? "bg-indigo-50 text-indigo-700" : "bg-blue-50 text-blue-700";

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${badge}`}>法人・士業限定</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">無料デモ・お見積もり申込</h2>
          <p className="text-sm text-gray-500">3営業日以内にご連絡いたします</p>
        </div>
        {submitted ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <div className="text-4xl mb-3">✅</div>
            <p className="font-bold text-gray-900 mb-2">メールアプリが開きました</p>
            <p className="text-sm text-gray-500">送信後、3営業日以内にご連絡いたします。<br />メールが開かない場合は <span className="font-medium">support@pokkorilab.com</span> まで直接ご連絡ください。</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">会社名 <span className="text-red-500">*</span></label>
                <input required value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="株式会社○○" className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none ${ring}`} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">担当者名 <span className="text-red-500">*</span></label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="山田 太郎" className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none ${ring}`} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">メールアドレス <span className="text-red-500">*</span></label>
                <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="info@example.com" className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none ${ring}`} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">電話番号</label>
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="090-0000-0000" className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none ${ring}`} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">ご利用目的</label>
              <select value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))} className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none ${ring}`}>
                <option value="">選択してください</option>
                {purposes.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <button type="submit" className={`w-full ${btn} text-white font-bold py-3 rounded-xl text-sm transition-colors`}>
              無料デモを申し込む →
            </button>
            <p className="text-xs text-gray-400 text-center">送信するとメールアプリが開きます。3営業日以内にご連絡します。</p>
          </form>
        )}
      </div>
    </section>
  );
}

const PROBLEMS = [
  { title: "弁護士に依頼すると1契約のレビューに¥5〜15万かかる", desc: "AIで事前スクリーニング。弁護士費用を最小化しリスクだけを弁護士に相談できる。" },
  { title: "フリーランスが不利な契約条件に気づかず署名してしまった", desc: "AI が報酬未払い・著作権譲渡・秘密保持など13項目のリスクを自動検出。" },
  { title: "法務部がない中小企業で契約書を誰もチェックできない", desc: "法務担当不在でも即使える。契約ごとのリスク評価とリスクレベル（高/中/低）を明示。" },
  { title: "複数のフリーランス・外注先と多数の契約を結ぶ企業の法務コスト", desc: "チームプランで複数ユーザーが無制限にレビュー可能。月¥9,800で法務コストを固定化。" },
];

const USECASES = [
  {
    icon: "💼",
    title: "フリーランス・個人事業主",
    problem: "業務委託契約・NDA・著作権譲渡条項を見落とし、後から揉めるケースが多い。",
    solution: "契約書をテキストで貼り付けるだけ。20,000文字まで対応。修正提案文も自動生成。",
    result: "契約トラブルのリスクを事前に可視化",
  },
  {
    icon: "🏢",
    title: "中小企業・スタートアップ",
    problem: "法務担当なしで外注・業務委託・SaaS利用規約を大量に締結。リスクを把握できていない。",
    solution: "チームプランで全社員が契約レビューに使える。月¥9,800で法務リスクを一元管理。",
    result: "法務コストを弁護士費用比90%削減",
  },
  {
    icon: "⚖️",
    title: "司法書士・行政書士事務所",
    problem: "顧客からの契約書相談に対して、毎回ゼロから確認するのが非効率。",
    solution: "AIで1次スクリーニング後、弁護士確認が必要な箇所だけに集中できる。提案件数が向上。",
    result: "1件あたりの対応時間を2時間 → 30分に短縮",
  },
];

const PLANS = [
  {
    name: "個人プラン",
    price: "¥980",
    per: "/月",
    target: "フリーランス・個人事業主",
    features: ["月5契約まで", "13項目リスク診断", "修正文案生成", "8,000文字まで対応"],
    cta: "まず1ヶ月お試し ¥980",
    highlight: false,
  },
  {
    name: "チームプラン",
    price: "¥9,800",
    per: "/月",
    target: "中小企業・法務担当なし企業",
    features: ["無制限レビュー", "20,000文字対応（プレミアム）", "チームアカウント（5名）", "リスクレベル判定（高/中/低）", "請求書払い対応"],
    cta: "まず1ヶ月お試し ¥9,800",
    highlight: true,
  },
  {
    name: "事務所プラン",
    price: "要相談",
    per: "",
    target: "士業事務所・法務部門向け",
    features: ["アカウント数無制限", "カスタムチェックリスト設定", "顧客別レポート出力", "専任サポート担当", "API連携対応"],
    cta: "お問い合わせ",
    highlight: false,
  },
];

const ONBOARDING_STEPS = [
  {
    day: "今日",
    title: "申し込む（3分）",
    desc: "クレジットカードで即時決済。メールアドレスのみで登録完了。",
    icon: "📝",
    color: "bg-indigo-600",
  },
  {
    day: "今日中",
    title: "契約書をレビューする",
    desc: "契約書テキストを貼り付けるだけ。30秒でリスク診断レポートが完成。",
    icon: "🔍",
    color: "bg-green-500",
  },
  {
    day: "今週中",
    title: "修正交渉・署名へ",
    desc: "AIの修正提案文をそのまま相手方に送付。リスクを排除してから安心して署名。",
    icon: "✅",
    color: "bg-purple-500",
  },
];

const FAQ_ITEMS = [
  {
    q: "法的アドバイスとして使えますか？",
    a: "本サービスはAIによる参考情報の提供であり、法的アドバイスではありません。重要な契約・高額取引・訴訟リスクがある案件については、必ず弁護士にご相談ください。AIで1次スクリーニングを行い、問題箇所だけを弁護士に相談することで弁護士費用を大幅に削減できます。",
  },
  {
    q: "どんな種類の契約書に対応していますか？",
    a: "業務委託契約、NDA（秘密保持契約）、SaaS利用規約、雇用契約、売買契約、賃貸借契約、フランチャイズ契約など、ほぼすべての日本語契約書に対応しています。英語契約書は現在対応準備中です。",
  },
  {
    q: "チームプランで複数人が使えますか？",
    a: "はい。チームプランでは5名まで同時利用できます。各ユーザーが独自の契約書をレビュー可能で、月間のレビュー件数は無制限です。",
  },
  {
    q: "入力した契約書の内容はどう扱われますか？",
    a: "入力された契約書テキストはAI分析のみに使用され、第三者への提供・学習データへの使用は一切行いません。通信はHTTPS暗号化。契約書内の機密情報は安全に処理されます。",
  },
  {
    q: "請求書払い・銀行振込は対応していますか？",
    a: "チームプラン・事務所プランで請求書払いに対応しています。月次・年次払いが選べます。お問い合わせフォームからご連絡ください。",
  },
  {
    q: "解約はいつでもできますか？",
    a: "はい、いつでも解約可能です。解約後は次回更新日まで引き続きご利用いただけます。",
  },
];

function ROICalculator() {
  const [contractsPerMonth, setContractsPerMonth] = useState(10);
  const lawyerCostPerContract = 50000; // 弁護士レビュー最低¥5万/件

  const lawyerTotalCost = contractsPerMonth * lawyerCostPerContract;
  const planCost = 9800; // チームプラン月額
  const saving = lawyerTotalCost - planCost;

  return (
    <div className="bg-white rounded-2xl border border-indigo-100 shadow-lg p-6 md:p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">弁護士費用との比較計算機</h3>
      <p className="text-sm text-gray-500 text-center mb-8">月間契約書レビュー件数を入力して、弁護士費用との差額を確認</p>

      <div className="space-y-6 mb-8">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-gray-700">月間のレビュー契約書数</label>
            <span className="text-2xl font-bold text-indigo-600">{contractsPerMonth}件</span>
          </div>
          <input
            type="range"
            min={1}
            max={100}
            step={1}
            value={contractsPerMonth}
            onChange={(e) => setContractsPerMonth(Number(e.target.value))}
            className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1件</span>
            <span>100件</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 rounded-xl p-4 text-center">
          <p className="text-xs text-red-600 font-semibold mb-1">弁護士依頼の場合</p>
          <p className="text-3xl font-bold text-red-700">¥{(lawyerTotalCost / 10000).toFixed(0)}<span className="text-lg">万</span></p>
          <p className="text-xs text-gray-500 mt-1">¥5万/件 × {contractsPerMonth}件</p>
        </div>
        <div className="bg-indigo-50 rounded-xl p-4 text-center">
          <p className="text-xs text-indigo-600 font-semibold mb-1">契約書AIの月額</p>
          <p className="text-3xl font-bold text-indigo-700">¥0.98<span className="text-lg">万</span></p>
          <p className="text-xs text-gray-500 mt-1">チームプラン ¥9,800/月</p>
        </div>
        <div className={`rounded-xl p-4 text-center ${saving > 0 ? "bg-green-50" : "bg-gray-50"}`}>
          <p className={`text-xs font-semibold mb-1 ${saving > 0 ? "text-green-600" : "text-gray-500"}`}>月間節約額</p>
          <p className={`text-3xl font-bold ${saving > 0 ? "text-green-700" : "text-gray-500"}`}>
            {saving > 0 ? "+" : ""}¥{(saving / 10000).toFixed(0)}<span className="text-lg">万</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">{saving > 0 ? "純コスト削減" : "件数が増えると効果大"}</p>
        </div>
      </div>

      {saving > 0 && (
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl p-4 text-white text-center">
          <p className="text-sm font-bold mb-1">
            月{contractsPerMonth}件レビューする場合、¥9,800/月の投資で
          </p>
          <p className="text-2xl font-bold">
            月¥{Math.round(saving / 10000)}万円のコスト削減
          </p>
          <p className="text-indigo-200 text-xs mt-1">ROI {Math.round((saving / 9800) * 100)}%（月次）</p>
        </div>
      )}

      <div className="mt-4 text-center">
        <Link
          href="/tool"
          className="inline-block bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-indigo-700 shadow-md text-sm"
        >
          まず1ヶ月お試し ¥980 →
        </Link>
      </div>
    </div>
  );
}

export default function BusinessLP() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-6 py-4 sticky top-0 bg-white/95 backdrop-blur z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-bold text-gray-900">契約書AIレビュー <span className="text-indigo-600 text-sm font-medium ml-2">法人・士業向け</span></span>
          <div className="flex gap-3">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">個人向けはこちら</Link>
            <Link href="/tool" className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700">無料で試す</Link>
          </div>
        </div>
      </nav>

      {/* ヒーロー */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-6">
          フリーランス・中小企業・士業事務所向け法人プラン
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          弁護士費用¥5万を<br /><span className="text-indigo-600">月¥980に変える</span>
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
          契約書をテキストで貼り付けるだけ。30秒で13項目のリスク診断・修正提案文を生成。<br />
          法務担当なしでも契約トラブルを事前に防げます。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/tool" className="inline-block bg-indigo-600 text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100">
            まず1件無料でレビューする →
          </Link>
          <a href="mailto:support@pokkorilab.com?subject=契約書AIレビュー法人プランについて" className="inline-block bg-gray-100 text-gray-700 font-bold text-lg px-8 py-4 rounded-xl hover:bg-gray-200">
            法人見積もりを依頼
          </a>
        </div>
        <p className="text-xs text-gray-400 mt-4">解約はいつでも可能</p>
      </section>

      {/* ROI スタッツ */}
      <section className="bg-indigo-600 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-white">
            {[
              { num: "90%", label: "法務コストの削減", sub: "弁護士費用比¥5万 → ¥980" },
              { num: "30秒", label: "レビューにかかる時間", sub: "従来は弁護士に数日待ち" },
              { num: "13項目", label: "自動チェック項目数", sub: "報酬・著作権・秘密保持など" },
            ].map(stat => (
              <div key={stat.num}>
                <div className="text-4xl font-bold mb-1">{stat.num}</div>
                <div className="text-sm font-medium text-indigo-100">{stat.label}</div>
                <div className="text-xs text-indigo-200 mt-1">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI計算機 */}
      <section className="py-16 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-3">弁護士費用との比較を計算する</h2>
          <p className="text-center text-gray-500 text-sm mb-10">月間レビュー件数を入力するだけで節約額が即座にわかります</p>
          <ROICalculator />
        </div>
      </section>

      {/* 導入ステップ */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-3">3ステップで契約リスクをゼロにする</h2>
          <p className="text-center text-gray-500 text-sm mb-12">今日申し込めば、今日中に最初の契約書をレビューできます</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ONBOARDING_STEPS.map((step, i) => (
              <div key={i} className="text-center relative">
                <div className={`w-20 h-20 rounded-full ${step.color} text-white text-3xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  {step.icon}
                </div>
                <div className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full mb-2">
                  {step.day}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/tool" className="inline-block bg-indigo-600 text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100">
              まず1件無料でレビューする →
            </Link>
            <p className="text-xs text-gray-400 mt-3">解約はいつでも可能</p>
          </div>
        </div>
      </section>

      {/* 課題 */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10">こんな課題を解決します</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PROBLEMS.map(p => (
              <div key={p.title} className="bg-white rounded-xl p-5 border border-gray-100">
                <p className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
                  <span className="text-red-500 shrink-0 mt-0.5">✗</span>{p.title}
                </p>
                <p className="text-sm text-gray-500 flex items-start gap-2">
                  <span className="text-green-500 shrink-0 mt-0.5">→</span>{p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 業種別ユースケース */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10">職種・規模別の活用例</h2>
          <div className="space-y-5">
            {USECASES.map(u => (
              <div key={u.title} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{u.icon}</span>
                  <h3 className="text-lg font-bold text-gray-900">{u.title}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-red-500 mb-1">課題</p>
                    <p className="text-sm text-gray-600">{u.problem}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-indigo-500 mb-1">解決策</p>
                    <p className="text-sm text-gray-600">{u.solution}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-green-600 mb-1">導入効果</p>
                    <p className="text-sm font-bold text-green-700">{u.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 料金 */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-3">法人・士業向け料金プラン</h2>
          <p className="text-center text-gray-500 text-sm mb-10">すべてのプランで13項目リスク診断・修正提案文・リスクレベル判定がフルセット</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map(plan => (
              <div key={plan.name} className={`rounded-2xl border p-6 relative flex flex-col ${plan.highlight ? "border-indigo-500 shadow-xl shadow-indigo-50 bg-white" : "border-gray-200 bg-white"}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-indigo-600 text-white px-3 py-0.5 rounded-full whitespace-nowrap">法人に一番人気</div>
                )}
                <p className="text-xs text-gray-400 mb-1">{plan.target}</p>
                <p className="font-bold text-gray-900 text-lg mb-1">{plan.name}</p>
                <p className="text-3xl font-bold text-indigo-600 mb-5">
                  {plan.price}<span className="text-sm font-normal text-gray-500">{plan.per}</span>
                </p>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-green-500 shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.cta === "お問い合わせ" ? "mailto:support@pokkorilab.com?subject=契約書AI事務所プランについて" : "/tool"}
                  className={`block w-full text-center text-sm font-bold py-3 rounded-xl ${plan.highlight ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">解約はいつでも可能</p>
        </div>
      </section>

      {/* CTA（中間） */}
      <section className="py-12 px-6">
        <div className="max-w-2xl mx-auto bg-indigo-600 rounded-2xl p-8 text-center text-white">
          <p className="text-sm font-semibold text-indigo-200 mb-2">まずは実際のレビュー精度を体感してください</p>
          <h2 className="text-2xl font-bold mb-4">今日申し込めば、今日中に最初の契約書をレビューできます</h2>
          <Link href="/tool" className="inline-block bg-white text-indigo-600 font-bold text-lg px-8 py-4 rounded-xl hover:bg-indigo-50 shadow-lg">
            まず1件無料でレビューする →
          </Link>
          <p className="text-indigo-200 text-xs mt-3">解約はいつでも可能</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10">よくある質問</h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
                <p className="font-semibold text-gray-900 mb-2 text-sm">Q. {faq.q}</p>
                <p className="text-sm text-gray-600">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 法人デモ申込フォーム */}
      <DemoForm accentColor="indigo" serviceName="契約書AIレビュー" purposes={PURPOSES_KEIYAKU} />

      {/* 最終CTA */}
      <section className="bg-indigo-600 py-16 text-center px-6">
        <h2 className="text-2xl font-bold text-white mb-3">契約リスクを、今日から見える化する</h2>
        <p className="text-indigo-100 text-sm mb-8">解約はいつでも可能。リスクなくお試しいただけます。</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/tool" className="inline-block bg-white text-indigo-600 font-bold text-lg px-8 py-4 rounded-xl hover:bg-indigo-50 shadow-lg">
            まず1件無料でレビューする →
          </Link>
          <a href="mailto:support@pokkorilab.com?subject=契約書AI法人プランについて" className="inline-block bg-indigo-500 text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-indigo-400">
            法人見積もりを依頼
          </a>
        </div>
      </section>

      <footer className="border-t py-6 text-center text-xs text-gray-400 space-x-4">
        <Link href="/legal" className="hover:underline">特定商取引法に基づく表記</Link>
        <Link href="/privacy" className="hover:underline">プライバシーポリシー</Link>
      </footer>
    </main>
  );
}
