"use client";
import { useState } from "react";
import Link from "next/link";
import PayjpModal from "@/components/PayjpModal";

// ===== 4タブサンプルデータ =====
const SAMPLE_TABS = [
  {
    id: "gyoumu",
    label: "業務委託",
    contractType: "業務委託契約書",
    target: "フリーランス Webエンジニア向け",
    score: 61,
    grade: "C",
    gradeColor: "text-yellow-400",
    borderColor: "border-yellow-500/40",
    barColor: "from-yellow-600 to-yellow-400",
    items: [
      {
        level: "高",
        icon: "🔴",
        iconBg: "bg-red-900/30 border-red-700/50",
        titleColor: "text-red-300",
        title: "第8条（著作権） — 危険度: 高",
        body: "「制作物の著作権は甲に帰属する」",
        suggestion: "「著作財産権は乙に帰属し、甲への利用許諾とする」に変更。未払い時の保護になります。",
      },
      {
        level: "中",
        icon: "🟡",
        iconBg: "bg-orange-900/20 border-orange-700/40",
        titleColor: "text-orange-300",
        title: "第12条（競業禁止） — 危険度: 中",
        body: "「契約終了後2年間、同業他社への役務提供を禁止する」",
        suggestion: "一般的な期間は6ヶ月〜1年。「6ヶ月以内」への短縮を交渉してください。",
      },
      {
        level: "低",
        icon: "🟡",
        iconBg: "bg-orange-900/20 border-orange-700/40",
        titleColor: "text-orange-300",
        title: "報酬支払い遅延ペナルティなし",
        body: "支払い遅延に対するペナルティ条項が存在しない",
        suggestion: "「支払期日を過ぎた場合、年14.6%の遅延損害金を請求できる」条項の追加を推奨します。",
      },
    ],
  },
  {
    id: "nda",
    label: "NDA（秘密保持）",
    contractType: "NDA（秘密保持契約書）",
    target: "スタートアップ間の業務提携",
    score: 84,
    grade: "B",
    gradeColor: "text-green-400",
    borderColor: "border-green-500/40",
    barColor: "from-green-600 to-green-400",
    items: [
      {
        level: "なし",
        icon: "🟢",
        iconBg: "bg-green-900/20 border-green-700/40",
        titleColor: "text-green-300",
        title: "秘密情報の定義 — 問題なし",
        body: "秘密情報の定義が明確に記載されている",
        suggestion: "この条項は適切です。変更不要。",
      },
      {
        level: "低",
        icon: "🟡",
        iconBg: "bg-orange-900/20 border-orange-700/40",
        titleColor: "text-orange-300",
        title: "有効期間（第5条） — 危険度: 低",
        body: "「契約終了後3年間」秘密保持義務が続く",
        suggestion: "業界標準は2年。削減交渉の余地があります。「契約終了後2年間」への変更を検討してください。",
      },
      {
        level: "低",
        icon: "🟡",
        iconBg: "bg-orange-900/20 border-orange-700/40",
        titleColor: "text-orange-300",
        title: "損害賠償の上限なし",
        body: "情報漏洩時の損害賠償額に上限設定がない",
        suggestion: "「損害賠償額は契約金額の範囲内とする」等の上限条項の追加を交渉することを推奨します。",
      },
    ],
  },
  {
    id: "chintai",
    label: "賃貸契約",
    contractType: "賃貸借契約書",
    target: "個人 → 賃借人（入居者）",
    score: 55,
    grade: "C",
    gradeColor: "text-yellow-400",
    borderColor: "border-yellow-500/40",
    barColor: "from-yellow-600 to-yellow-400",
    items: [
      {
        level: "高",
        icon: "🔴",
        iconBg: "bg-red-900/30 border-red-700/50",
        titleColor: "text-red-300",
        title: "第9条（原状回復） — 危険度: 高",
        body: "「退去時は全室クリーニング費用を借主が負担する」",
        suggestion: "国土交通省ガイドラインでは経年劣化は貸主負担。「通常損耗を超える損傷のみ借主負担」に修正交渉を。",
      },
      {
        level: "中",
        icon: "🟡",
        iconBg: "bg-orange-900/20 border-orange-700/40",
        titleColor: "text-orange-300",
        title: "途中解約（第4条） — 危険度: 中",
        body: "「解約の申し入れは3ヶ月前までに行う」",
        suggestion: "借地借家法では1ヶ月前が原則。「3ヶ月前」は過剰。「1〜2ヶ月前」への短縮交渉が可能です。",
      },
      {
        level: "なし",
        icon: "🟢",
        iconBg: "bg-green-900/20 border-green-700/40",
        titleColor: "text-green-300",
        title: "敷金返還（第3条） — 問題なし",
        body: "「退去後1ヶ月以内に敷金を返還する」と明記",
        suggestion: "適切な条項です。変更不要。",
      },
    ],
  },
  {
    id: "teikei",
    label: "業務提携",
    contractType: "業務提携契約書",
    target: "中小企業間の販売代理店契約",
    score: 72,
    grade: "B",
    gradeColor: "text-blue-400",
    borderColor: "border-blue-500/40",
    barColor: "from-blue-600 to-blue-400",
    items: [
      {
        level: "中",
        icon: "🟡",
        iconBg: "bg-orange-900/20 border-orange-700/40",
        titleColor: "text-orange-300",
        title: "第6条（独占販売権） — 危険度: 中",
        body: "「乙は本製品を甲以外から仕入れてはならない」",
        suggestion: "独占条項は競争を制限します。「本製品カテゴリに限定」または「優先販売権」への緩和交渉を推奨。",
      },
      {
        level: "低",
        icon: "🟡",
        iconBg: "bg-orange-900/20 border-orange-700/40",
        titleColor: "text-orange-300",
        title: "第11条（契約解除） — 危険度: 低",
        body: "「甲は30日前通知で本契約を解除できる」",
        suggestion: "一方的解除が可能な条項です。「双方合意による解除」または「90日前通知」への変更を検討してください。",
      },
      {
        level: "なし",
        icon: "🟢",
        iconBg: "bg-green-900/20 border-green-700/40",
        titleColor: "text-green-300",
        title: "手数料条項（第4条） — 問題なし",
        body: "手数料率・支払いタイミングが明確に規定されている",
        suggestion: "適切な条項です。変更不要。",
      },
    ],
  },
] as const;

// ===== インタラクティブデモ用サンプルテキスト =====
const DEMO_CONTRACT_TEXT = `業務委託契約書

甲（委託者）: 株式会社〇〇
乙（受託者）: フリーランス 山田太郎

第1条（委託業務）
甲は乙に対し、Webサイト制作業務を委託する。

第2条（委託料）
甲は乙に対し、委託料として金300,000円（税別）を支払う。
支払い期日は納品確認後60日以内とする。

第3条（著作権）
乙が本業務で制作した成果物の著作権は、完成と同時に甲に帰属する。

第4条（競業禁止）
乙は本契約終了後2年間、甲の競合他社に対して同種の業務を提供してはならない。

第5条（秘密保持）
乙は業務上知り得た甲の業務情報を第三者に開示してはならない。本条の効力は契約終了後も存続する。

第6条（損害賠償）
乙の業務上の過失により甲が損害を被った場合、乙は甲に生じた全ての損害を賠償する。`;

// ===== サンプルタブコンポーネント =====
function SampleAnalysisTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const tab = SAMPLE_TABS[activeTab];
  return (
    <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
      {/* タブバー */}
      <div className="bg-slate-700/60 px-4 pt-4 flex flex-wrap gap-2 border-b border-slate-600">
        {SAMPLE_TABS.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition-all whitespace-nowrap ${
              activeTab === i
                ? "border-indigo-400 bg-slate-800 text-indigo-300"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-600/40"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ヘッダー */}
      <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 border-b border-slate-600">
        <div className="flex-1">
          <p className="text-sm font-bold text-white">{tab.contractType}</p>
          <p className="text-xs text-slate-400">{tab.target}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-3xl font-black ${tab.gradeColor}`}>{tab.grade}</span>
          <div>
            <p className="text-xs text-slate-400">リスクスコア</p>
            <div className="flex items-center gap-2">
              <div className="w-24 bg-slate-700 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full bg-gradient-to-r ${tab.barColor}`} style={{ width: `${tab.score}%` }} />
              </div>
              <span className="text-xs font-bold text-white">{tab.score}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* 問題条項リスト */}
      <div className="p-5 space-y-3">
        {tab.items.map((item, i) => (
          <div key={i} className={`border rounded-lg p-3 ${item.iconBg}`}>
            <p className={`text-xs font-bold mb-1 ${item.titleColor}`}>
              {item.icon} {item.title}
            </p>
            <p className="text-xs text-slate-300 mb-2 font-mono bg-slate-900/40 rounded px-2 py-1">{item.body}</p>
            <p className="text-xs text-indigo-300">💡 修正提案: {item.suggestion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== インタラクティブデモコンポーネント =====
function InteractiveDemo() {
  const [demoText, setDemoText] = useState("");
  const [phase, setPhase] = useState<"idle" | "filled" | "result">("idle");

  const fillSample = () => {
    setDemoText(DEMO_CONTRACT_TEXT);
    setPhase("filled");
  };

  const runAnalysis = () => {
    setPhase("result");
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
      {/* デモヘッダー */}
      <div className="bg-slate-700 px-4 py-3 flex items-center gap-2 border-b border-slate-600">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <span className="text-slate-400 text-xs ml-2">契約書AIレビュー — デモ</span>
      </div>

      <div className="p-4 space-y-3">
        {/* テキストエリア */}
        <div className="relative">
          <textarea
            value={demoText}
            onChange={e => { setDemoText(e.target.value); setPhase(e.target.value ? "filled" : "idle"); }}
            rows={6}
            placeholder="📄 契約書テキストをここに貼り付けてください..."
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-xs text-slate-300 placeholder:text-slate-500 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
          />
          {phase === "idle" && (
            <button
              onClick={fillSample}
              className="absolute bottom-3 right-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
            >
              サンプル業務委託契約書を入力する
            </button>
          )}
        </div>

        {/* 分析ボタン */}
        <button
          onClick={runAnalysis}
          disabled={!demoText.trim()}
          className={`w-full font-bold py-2.5 rounded-lg text-sm transition-all ${
            demoText.trim()
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-slate-700 text-slate-500 cursor-not-allowed"
          }`}
        >
          {phase === "result" ? "✓ 分析完了" : "分析する →"}
        </button>

        {/* 結果プレビュー */}
        {phase === "result" && (
          <div className="bg-slate-900 border border-slate-600 rounded-lg p-4 space-y-3 animate-pulse-once">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <span className="text-xs font-bold text-slate-400">📊 分析結果</span>
              <span className="text-lg font-black text-yellow-400">C評価 61/100</span>
            </div>
            <div className="space-y-2">
              {[
                { icon: "🔴", label: "著作権条項", status: "要注意", color: "text-red-400" },
                { icon: "🟡", label: "競業禁止期間", status: "中リスク（2年）", color: "text-yellow-400" },
                { icon: "🟡", label: "報酬遅延ペナルティ", status: "中リスク（未記載）", color: "text-yellow-400" },
                { icon: "🟢", label: "秘密保持条項", status: "問題なし", color: "text-green-400" },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">{r.icon} {r.label}</span>
                  <span className={`font-bold ${r.color}`}>{r.status}</span>
                </div>
              ))}
            </div>
            <Link
              href="/tool"
              className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-xs transition-all mt-2"
            >
              自分の契約書を無料でチェック →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

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
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <div className="inline-block bg-indigo-600 text-white text-sm font-bold px-4 py-1 rounded-full">
            AI × 契約書レビュー
          </div>
          <div className="inline-flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            <span>★ NEW</span>
            <span>2026年1月施行 取適法（旧下請法）対応</span>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            <span>✓</span>
            <span>フリーランス・中小企業に特化した契約書レビューAI</span>
          </div>
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
            {
              icon: "⚖️",
              title: "取引適正化法チェックモード",
              desc: "旧下請法から改正された取適法（2026年1月施行）に基づき、委託契約書の違反リスクをAIが判定。中小企業の委託事業者向けに特化。",
              badge: "NEW",
            },
          ].map((f) => (
            <div key={f.title} className={`bg-slate-800 rounded-2xl p-6 ${"badge" in f && f.badge ? "border border-orange-500/50" : ""}`}>
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                {f.title}
                {"badge" in f && f.badge && (
                  <span className="inline-block bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded align-middle">{f.badge}</span>
                )}
              </h3>
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

      {/* Sample Output — 4タブサンプル */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="inline-block bg-indigo-900 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">実際の分析例</div>
          <h2 className="text-3xl font-black mb-2">契約書タイプ別 分析レポートサンプル</h2>
          <p className="text-slate-400 text-sm">業務委託 / NDA / 賃貸 / 業務提携 — 4種類の実際の出力例をタブで確認</p>
        </div>
        <SampleAnalysisTabs />
        <p className="text-center text-xs text-slate-500 mt-4">※上記はサンプルです。実際の出力は契約書の内容によって異なります。</p>
        <div className="text-center mt-6">
          <Link href="/tool" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all text-sm">
            自分の契約書を無料でチェック →
          </Link>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="inline-block bg-indigo-900 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">デモ体験</div>
          <h2 className="text-3xl font-black mb-2">実際の画面で操作感を体験</h2>
          <p className="text-slate-400 text-sm">「サンプル業務委託契約書を入力する」を押してAI分析の流れを確認できます</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <InteractiveDemo />
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">こんな情報がわかります</h3>
            {[
              { icon: "📊", title: "総合評価 A〜E", desc: "契約書全体のリスクをスコアで即判断" },
              { icon: "⚠️", title: "問題条項の特定", desc: "危険な条項の場所と理由を具体的に説明" },
              { icon: "⚖️", title: "有利不利の整理", desc: "交渉すべきポイントを一覧化（Premium）" },
              { icon: "✏️", title: "修正文案の提示", desc: "そのままコピーして使える修正例文" },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 items-start">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-bold text-white text-sm">{item.title}</p>
                  <p className="text-slate-400 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
            <Link
              href="/tool"
              className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all text-sm mt-4"
            >
              無料で3回チェックする →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ — 取適法 */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-black text-center mb-8">よくある質問</h2>
        <div className="space-y-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <p className="font-bold text-white mb-2">Q: 取引適正化法（取適法）のチェックはできますか？</p>
            <p className="text-slate-300 text-sm leading-relaxed">
              はい。2026年1月に施行された取引適正化法（旧下請法）に対応したチェックモードを搭載。委託契約書・業務委託書の違反リスク（代金減額・返品・買いたたき等）を判定します。委託者・受託者どちらの立場からのリスクかも明示します。
            </p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <p className="font-bold text-white mb-2">Q: 取適法チェックモードはどんな企業に向いていますか？</p>
            <p className="text-slate-300 text-sm leading-relaxed">
              取適法の対象となる中小企業約358万社の委託事業者に特に有効です。発注側（委託者）・受注側（受託者）どちらの立場でも利用できます。弁護士への相談前の事前確認として最適です。
            </p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <p className="font-bold text-white mb-2">Q: 通常レビューと取適法チェックモードの違いは？</p>
            <p className="text-slate-300 text-sm leading-relaxed">
              通常レビューは著作権・競業禁止・損害賠償など一般的な契約リスクを幅広くチェックします。取適法チェックモードは取引適正化法（旧下請法）の6つの禁止行為に特化したチェックを追加で実施します。両方を組み合わせてご活用いただけます。
            </p>
          </div>
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

      {/* X(Twitter) Share */}
      <section className="max-w-4xl mx-auto px-4 py-10 text-center">
        <p className="text-slate-400 text-sm mb-4">AIが契約書のリスクを発見！フリーランス・副業の方にシェアしませんか？</p>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("AIが契約書から複数件のリスクを発見！弁護士いらずで契約書チェック。フリーランス・副業の方に必須ツール。業務委託・NDA・取適法対応。無料3回から試せる。 #契約書 #フリーランス #AI法務 #副業")}&url=${encodeURIComponent("https://keiyakusho-ai.vercel.app")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-black hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-all text-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          X(Twitter)でシェアする
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="/legal" className="hover:text-white">特定商取引法</Link>
          <Link href="/privacy" className="hover:text-white">プライバシーポリシー</Link>
          <Link href="/terms" className="hover:text-white">利用規約</Link>
        </div>
        <p className="mb-4">© 2026 契約書AIレビュー</p>
        <div className="border-t border-slate-700 pt-3 text-xs">
          <p className="mb-1">ポッコリラボの他のサービス</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-slate-600">
            <a href="https://claim-ai-beryl.vercel.app" className="hover:text-slate-400">クレームAI</a>
            <a href="https://hojyokin-ai-delta.vercel.app" className="hover:text-slate-400">補助金AI</a>
            <a href="https://pawahara-ai.vercel.app" className="hover:text-slate-400">パワハラ対策AI</a>
            <a href="https://rougo-sim-ai.vercel.app" className="hover:text-slate-400">老後シミュレーターAI</a>
            <a href="https://ai-keiei-keikaku.vercel.app" className="hover:text-slate-400">AI経営計画書</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
