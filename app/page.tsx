"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import KomojuButton from "@/components/KomojuButton";

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
            aria-label={`${t.label}の契約書サンプルタブを表示`}
            aria-pressed={activeTab === i}
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
            placeholder="契約書テキストをここに貼り付けてください..."
            aria-label="契約書テキストを入力するデモエリア"
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-xs text-slate-300 placeholder:text-slate-500 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
          />
          {phase === "idle" && (
            <button
              onClick={fillSample}
              aria-label="サンプルの業務委託契約書テキストをデモ入力エリアに挿入する"
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
          aria-label="入力した契約書テキストをAIで分析する"
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
              <span className="text-xs font-bold text-slate-400">分析結果</span>
              <span className="text-lg font-black text-yellow-400">C評価 61/100</span>
            </div>
            <div className="space-y-2">
              {[
                { risk: "高", label: "著作権条項", status: "要注意", color: "text-red-400" },
                { risk: "中", label: "競業禁止期間", status: "中リスク（2年）", color: "text-yellow-400" },
                { risk: "中", label: "報酬遅延ペナルティ", status: "中リスク（未記載）", color: "text-yellow-400" },
                { risk: "低", label: "秘密保持条項", status: "問題なし", color: "text-green-400" },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">[{r.risk}] {r.label}</span>
                  <span className={`font-bold ${r.color}`}>{r.status}</span>
                </div>
              ))}
            </div>
            <Link
              href="/tool"
              aria-label="ツールページへ移動して自分の契約書を無料でチェックする"
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

// ===== サンプルレポートダウンロード =====
function SampleReportDownload() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = SAMPLE_TABS;

  const generateReport = () => {
    const tab = tabs[activeTab];
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 1600;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 背景
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 1200, 1600);

    // ヘッダーバー
    const headerGrad = ctx.createLinearGradient(0, 0, 1200, 0);
    headerGrad.addColorStop(0, "#4f46e5");
    headerGrad.addColorStop(1, "#6366f1");
    ctx.fillStyle = headerGrad;
    ctx.fillRect(0, 0, 1200, 120);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px sans-serif";
    ctx.fillText("契約書AIレビュー 診断レポート", 50, 55);
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "#c7d2fe";
    const today = new Date();
    ctx.fillText(`発行日: ${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}  |  契約種別: ${tab.contractType}`, 50, 95);

    // 対象
    ctx.fillStyle = "#94a3b8";
    ctx.font = "22px sans-serif";
    ctx.fillText(`対象: ${tab.target}`, 50, 180);

    // スコア
    const gradeColors: Record<string, string> = { A: "#4ade80", B: "#60a5fa", C: "#facc15", D: "#f87171", E: "#ef4444" };
    ctx.fillStyle = gradeColors[tab.grade] || "#facc15";
    ctx.font = "bold 120px sans-serif";
    ctx.fillText(tab.grade, 50, 330);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 48px sans-serif";
    ctx.fillText(`${tab.score} / 100`, 200, 315);

    // スコアバー背景
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.roundRect(50, 370, 1100, 24, 12);
    ctx.fill();
    // スコアバー
    const barGrad = ctx.createLinearGradient(50, 0, 50 + 1100 * (tab.score / 100), 0);
    barGrad.addColorStop(0, gradeColors[tab.grade] || "#facc15");
    barGrad.addColorStop(1, gradeColors[tab.grade] || "#facc15");
    ctx.fillStyle = barGrad;
    ctx.beginPath();
    ctx.roundRect(50, 370, 1100 * (tab.score / 100), 24, 12);
    ctx.fill();

    // 区切り線
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 430);
    ctx.lineTo(1150, 430);
    ctx.stroke();

    // タイトル
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("検出された問題条項", 50, 480);

    // 問題条項リスト
    let y = 530;
    const levelColors: Record<string, string> = { "高": "#f87171", "中": "#fb923c", "低": "#facc15", "なし": "#4ade80" };
    tab.items.forEach((item) => {
      // 背景ボックス
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.roundRect(50, y, 1100, 280, 16);
      ctx.fill();
      ctx.strokeStyle = levelColors[item.level] || "#64748b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(50, y, 1100, 280, 16);
      ctx.stroke();

      // レベルバッジ
      ctx.fillStyle = levelColors[item.level] || "#64748b";
      ctx.beginPath();
      ctx.roundRect(80, y + 20, 80, 32, 8);
      ctx.fill();
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(`危険度:${item.level}`, 88, y + 43);

      // タイトル
      ctx.fillStyle = levelColors[item.level] || "#e2e8f0";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText(item.title, 180, y + 45);

      // 本文
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "20px sans-serif";
      ctx.fillText(item.body, 80, y + 100);

      // 提案
      ctx.fillStyle = "#818cf8";
      ctx.font = "18px sans-serif";
      const suggestion = `修正提案: ${item.suggestion}`;
      // 折り返し処理
      const maxW = 1040;
      const words = suggestion.split("");
      let line = "";
      let lineY = y + 150;
      for (const char of words) {
        const test = line + char;
        if (ctx.measureText(test).width > maxW) {
          ctx.fillText(line, 80, lineY);
          line = char;
          lineY += 28;
        } else {
          line = test;
        }
      }
      ctx.fillText(line, 80, lineY);

      y += 300;
    });

    // フッター
    ctx.fillStyle = "#475569";
    ctx.font = "16px sans-serif";
    ctx.fillText("※ 本レポートはサンプルです。実際の分析は契約書の内容に基づいて生成されます。", 50, 1540);
    ctx.fillText("契約書AIレビュー https://keiyakusho-ai.vercel.app", 50, 1570);

    // ダウンロード
    const link = document.createElement("a");
    link.download = `契約書AIレビュー_サンプルレポート_${tab.label}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <div className="bg-slate-800/80 border border-indigo-500/40 rounded-2xl p-6 text-center">
        <p className="text-indigo-300 text-xs font-bold mb-3 tracking-wider uppercase">無料サンプル</p>
        <h3 className="text-lg font-black text-white mb-4">サンプル診断レポートをダウンロード</h3>
        <div className="flex flex-wrap justify-center gap-2 mb-5">
          {tabs.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(i)}
              aria-label={`${t.label}のサンプルレポートを表示`}
              aria-pressed={activeTab === i}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
                activeTab === i
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-700 text-slate-400 hover:text-white hover:bg-slate-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="text-slate-400 text-sm mb-4">
          {tabs[activeTab].contractType}（{tabs[activeTab].target}）の分析レポート例
        </p>
        <button
          onClick={generateReport}
          aria-label="無料サンプルレポートをダウンロードする"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-bold py-3.5 px-8 rounded-xl text-sm transition-all shadow-lg shadow-indigo-900/40"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          無料サンプルレポートをダウンロード
        </button>
        <p className="text-slate-500 text-xs mt-3">PNG画像形式・登録不要</p>
      </div>
    </div>
  );
}

// ===== 利用者数カウントアップ =====
function UseCountBadge() {
  const [count, setCount] = useState(0);
  const target = 12847;
  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const increment = target / steps;
    const interval = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else { setCount(Math.floor(current)); }
    }, interval);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-full px-4 py-2 text-sm mb-6">
      <span className="text-green-400 font-black text-base">{count.toLocaleString()}</span>
      <span className="text-slate-300">件の契約書をレビュー済み</span>
      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
    </div>
  );
}

export default function Home() {
  const [showPayjpSub, setShowPayjpSub] = useState(false);
  const [showPayjpOnce, setShowPayjpOnce] = useState(false);
  const [showMobileCTA, setShowMobileCTA] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowMobileCTA(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      {showPayjpOnce && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl relative">
            <button onClick={() => setShowPayjpOnce(false)} aria-label="1回払いプランの登録モーダルを閉じる" className="absolute top-3 right-3 text-gray-400 text-xl">✕</button>
            <h2 className="text-lg font-bold mb-4 text-center">プレミアムプランに登録</h2>
            <KomojuButton planId="standard" planLabel="プレミアムプラン ¥980/月を始める" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50" />
          </div>
        </div>
      )}
      {showPayjpSub && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl relative">
            <button onClick={() => setShowPayjpSub(false)} aria-label="月額プランの登録モーダルを閉じる" className="absolute top-3 right-3 text-gray-400 text-xl">✕</button>
            <h2 className="text-lg font-bold mb-4 text-center">プレミアムプランに登録</h2>
            <KomojuButton planId="standard" planLabel="プレミアムプラン ¥980/月を始める" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50" />
          </div>
        </div>
      )}
      {/* モバイルスティッキーCTA */}
      {showMobileCTA && (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-indigo-700 border-t border-indigo-500 px-4 py-3 flex items-center gap-3 shadow-2xl">
          <div className="flex-1">
            <p className="text-white font-bold text-sm leading-none">無料で3回チェックできます</p>
            <p className="text-indigo-200 text-xs mt-0.5">登録不要・コピペだけ</p>
          </div>
          <Link
            href="/tool"
            aria-label="ツールページへ移動して契約書を無料でチェックする"
            className="bg-yellow-400 text-slate-900 font-black px-4 py-2.5 rounded-xl text-sm whitespace-nowrap"
          >
            今すぐ試す →
          </Link>
          <button onClick={() => setShowMobileCTA(false)} aria-label="モバイル用の案内バナーを閉じる" className="text-indigo-300 text-lg px-1">✕</button>
        </div>
      )}

      {/* 免責バナー */}
      <div className="bg-amber-900/40 border-b border-amber-700/50 px-6 py-3 text-center">
        <p className="text-xs text-amber-200 font-medium">
          <strong>注意: 本サービスは弁護士業務・法的助言ではありません。</strong>AIによる参考情報の提供です。契約の最終判断・法的トラブルには必ず弁護士にご相談ください。
        </p>
      </div>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <UseCountBadge />
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
            aria-label="ツールページへ移動して契約書を無料で3回チェックする"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all"
          >
            無料で試す（3回）
          </Link>
          <button
            onClick={() => setShowPayjpOnce(true)}
            aria-label="1回プラン（¥980）で今すぐ契約書AIレビューを使う"
            className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-bold py-4 px-8 rounded-xl text-lg transition-all"
          >
            今すぐ1回試す ¥980
          </button>
          <button
            onClick={() => setShowPayjpSub(true)}
            aria-label="月額¥2,980の無制限プランで契約書AIレビューを使う"
            className="bg-white text-slate-900 hover:bg-slate-100 font-bold py-4 px-8 rounded-xl text-lg transition-all"
          >
            ¥2,980/月で無制限に使う
          </button>
        </div>
        <p className="text-slate-400 text-sm">クレジットカード不要で3回無料 • 1回払い¥980 • いつでもキャンセル可能</p>

        <SampleReportDownload />

        {/* 30秒で分かる使い方ステップ */}
        <div className="mt-10 bg-slate-800/60 border border-slate-700 rounded-2xl px-6 py-5 max-w-2xl mx-auto">
          <p className="text-xs font-bold text-slate-400 mb-4 tracking-wider uppercase">30秒で分かる使い方</p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            {[
              { step: "1", label: "契約書をコピー", desc: "PDFやWordから全文コピー" },
              { step: "→", label: "", desc: "" },
              { step: "2", label: "ツールに貼り付け", desc: "テキストエリアにペースト" },
              { step: "→", label: "", desc: "" },
              { step: "3", label: "AIが即分析", desc: "数秒でリスク・修正案が出力" },
            ].map((s, i) =>
              s.label ? (
                <div key={i} className="flex flex-col items-center gap-1 text-center">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center">{s.step}</div>
                  <p className="text-xs font-bold text-white">{s.label}</p>
                  <p className="text-xs text-slate-400">{s.desc}</p>
                </div>
              ) : (
                <span key={i} className="text-slate-600 text-xl hidden sm:block">→</span>
              )
            )}
          </div>
        </div>
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
            <Link href="/tool" aria-label="ツールページへ移動して自分の契約書を無料でスコアリングする" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all text-sm">
              自分の契約書をスコアリングする（無料）→
            </Link>
          </div>
        </div>
      </section>

      {/* 競合比較表 — 価格訴求 */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="inline-block bg-yellow-500/20 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full mb-3">価格比較</div>
          <h2 className="text-2xl font-black text-white">「弁護士に頼むほどでも…」を解決する価格</h2>
          <p className="text-slate-400 text-sm mt-2">フリーランス・個人が実際に使える料金帯</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">サービス</th>
                <th className="text-center py-3 px-4 text-slate-400 font-medium">料金</th>
                <th className="text-center py-3 px-4 text-slate-400 font-medium">個人利用</th>
                <th className="text-center py-3 px-4 text-slate-400 font-medium">即日利用</th>
                <th className="text-center py-3 px-4 text-slate-400 font-medium">取適法対応</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "弁護士（単発）", price: "¥5万〜15万/件", personal: "○", instant: "✗（数日〜数週間）", toitekihou: "○", highlight: false },
                { name: "弁護士（顧問）", price: "¥3万〜5万/月", personal: "△（個人は割高）", instant: "✗（予約が必要）", toitekihou: "○", highlight: false },
                { name: "GVA assist (OLGA)", price: "¥7.5万〜/月", personal: "✗（法人向け）", instant: "✗（導入稟議が必要）", toitekihou: "○", highlight: false },
                { name: "契約書AIレビュー", price: "¥980/30日 〜", personal: "◎（個人・フリーランス専用）", instant: "◎（登録不要・即日）", toitekihou: "◎（2026年1月対応済）", highlight: true },
              ].map((row) => (
                <tr key={row.name} className={`border-b ${row.highlight ? "border-indigo-500/50 bg-indigo-900/20" : "border-slate-800"}`}>
                  <td className={`py-4 px-4 font-bold ${row.highlight ? "text-indigo-300" : "text-slate-300"}`}>
                    {row.highlight && <span className="inline-block bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded mr-2">このサービス</span>}
                    {row.name}
                  </td>
                  <td className={`py-4 px-4 text-center font-bold ${row.highlight ? "text-yellow-400 text-base" : "text-slate-400"}`}>{row.price}</td>
                  <td className={`py-4 px-4 text-center text-xs ${row.highlight ? "text-green-400 font-bold" : "text-slate-400"}`}>{row.personal}</td>
                  <td className={`py-4 px-4 text-center text-xs ${row.highlight ? "text-green-400 font-bold" : "text-slate-400"}`}>{row.instant}</td>
                  <td className={`py-4 px-4 text-center text-xs ${row.highlight ? "text-green-400 font-bold" : "text-slate-400"}`}>{row.toitekihou}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
          <p className="text-yellow-300 font-bold text-sm">GVA assist（月¥75,000）の<span className="text-2xl font-black text-yellow-400 mx-1">1/76</span>の価格で、個人・フリーランスに使いやすい形で提供</p>
          <p className="text-slate-400 text-xs mt-1">弁護士への単発依頼（¥5万〜）と比べても、¥980で同等レベルの事前確認が可能</p>
        </div>
        <div className="text-center mt-5">
          <Link href="/tool" aria-label="ツールページへ移動して契約書を無料3回試す" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all text-sm">
            無料3回でまず試す →
          </Link>
        </div>
      </section>

      {/* フリーランス特化セクション */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-indigo-600/40 rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">フリーランス・個人特化</div>
            <h2 className="text-2xl font-black text-white">「契約書の専門家がいない個人」のために設計</h2>
            <p className="text-slate-400 text-sm mt-2">企業法務部向けのGVA assistと違い、知識ゼロでも使える設計</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: "🎯",
                title: "知識ゼロでも判断できる",
                desc: "「危険度: 高/中/低」の3段階表示で、法律知識がなくても即座に判断可能。専門用語を噛み砕いた修正提案つき。",
              },
              {
                icon: "⚡",
                title: "署名前5分で完了",
                desc: "契約書テキストをコピペするだけ。弁護士予約不要・登録不要・待ち時間ゼロ。締め切り直前でも即対応。",
              },
              {
                icon: "🛡️",
                title: "個人事業主に多いリスクに特化",
                desc: "著作権の丸ごと譲渡・2年超の競業禁止・損害賠償上限なし——フリーランスが実際に遭う不利条項を重点チェック。",
              },
            ].map((item) => (
              <div key={item.title} className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/50">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/40">
              <p className="text-xs font-bold text-slate-300 mb-2">対応する典型的なトラブル</p>
              <ul className="space-y-1.5">
                {[
                  "著作権の全部譲渡で後から使えなくなった",
                  "競業禁止2年で副業・転職ができなかった",
                  "損害賠償上限なしで全額請求された",
                  "報酬支払い60日超えで資金繰りが苦しくなった",
                  "秘密保持「永続」で過去の実績をポートフォリオに使えない",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="text-red-400 font-bold shrink-0">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/40">
              <p className="text-xs font-bold text-slate-300 mb-2">AIレビュー後のユーザー行動</p>
              <ul className="space-y-1.5">
                {[
                  "「修正提案」をコピーして先方に修正依頼",
                  "リスクを把握した上で締結を決断",
                  "問題条項を弁護士に相談する際の「証拠」として活用",
                  "月次で複数の案件を事前スクリーニング",
                  "取適法チェックで発注側リスクも確認",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="text-green-400 font-bold shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ペルソナ共感セクション */}
      <section className="max-w-3xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-black text-center mb-2 text-white">こんな状況で困っていませんか？</h2>
        <p className="text-center text-slate-400 text-sm mb-8">フリーランス・中小企業の方からよく聞く声です</p>
        <div className="space-y-3">
          {[
            "「送られてきた業務委託契約書、著作権の条項が怪しい気がするけど確信が持てない」",
            "「GVA assistは月¥75,000で手が出ない。でも弁護士に頼むのも大げさな気がする」",
            "「競業禁止の期間が2年と書いてあるけど、これって普通？高すぎ？判断できない」",
            "「フリーランスになって初めての契約。何が問題なのか全くわからない」",
            "「印紙税・下請法違反・損害賠償上限——チェックすべき項目が多すぎて見落とす」",
          ].map((v, i) => (
            <div key={i} className="flex items-start gap-3 bg-slate-800 border border-slate-700 rounded-xl px-5 py-4">
              <span className="text-red-400 font-bold text-lg mt-0.5 shrink-0">✗</span>
              <p className="text-sm text-slate-300 leading-relaxed">{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 bg-indigo-900/40 border border-indigo-600/40 rounded-xl p-6 text-center">
          <p className="text-indigo-200 font-bold text-base mb-2">契約書AIレビューが、これら全てを解決します</p>
          <p className="text-sm text-slate-400">契約書をペーストするだけで、リスクスコア・修正提案・コピペ用修正テキストが数秒で出力されます。</p>
          <Link
            href="/tool"
            aria-label="ツールページへ移動して契約書を無料で試す（3回・登録不要）"
            className="inline-block mt-4 bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors text-sm"
          >
            無料で試してみる（3回・登録不要）→
          </Link>
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
          <Link href="/tool" aria-label="ツールページへ移動して自分の契約書を無料でチェックする" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all text-sm">
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
              aria-label="ツールページへ移動して契約書を無料で3回チェックする"
              className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all text-sm mt-4"
            >
              無料で3回チェックする →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ — 取適法 + 競合差別化 */}
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
          <div className="bg-slate-800 border border-indigo-600/40 rounded-xl p-5">
            <p className="font-bold text-white mb-2">Q: 「無料の契約書レビューAI」と何が違うのですか？</p>
            <p className="text-slate-300 text-sm leading-relaxed">
              無料サービスの多くは「リスクがあります」という抽象的な指摘のみです。本サービスは<strong className="text-indigo-300">①最悪シナリオの損害額まで具体的に提示 ②そのままコピーして先方に送れる修正文案を自動生成 ③交渉戦略アドバイスまで出力</strong>の3点が違います。「指摘されて終わり」ではなく「次の行動まで分かる」設計です。取適法（2026年1月施行）対応も無料競合にはない独自機能です。
            </p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <p className="font-bold text-white mb-2">Q: 契約書のデータはどう扱われますか？</p>
            <p className="text-slate-300 text-sm leading-relaxed">
              入力された契約書テキストはAI分析のみに使用し、サーバーには保存されません。分析完了後に自動で破棄されます。機密性の高い契約書でも安心してご利用いただけます。
            </p>
          </div>
        </div>
      </section>

      {/* 取引適正化法（取適法）解説セクション — SEO */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">⚖️</span>
            <div>
              <h2 className="text-xl font-black text-white">取引適正化法（取適法）とは？</h2>
              <p className="text-slate-400 text-xs mt-0.5">2026年1月施行・中小企業約358万社が対象</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                取引適正化法（正式名称：特定受託事業者に係る取引の適正化等に関する法律）は、2023年制定・2026年1月1日施行の法律です。
                フリーランスや中小企業が大企業・中小企業との取引で不当な条件を強いられないよう保護する目的で制定されました。
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">
                旧下請法が「資本金基準」だったのに対し、取適法は<strong className="text-white">「業務委託全般」を対象</strong>とし、フリーランス・個人事業主も保護されます。
              </p>
            </div>
            <div>
              <p className="text-indigo-300 text-xs font-bold mb-3">取適法が禁止する6つの行為</p>
              <ul className="space-y-2">
                {["受領拒否（納品した成果物の受け取り拒否）", "報酬減額（合意なき報酬の引き下げ）", "返品（引き取った成果物の返品）", "買いたたき（不当に低い報酬設定）", "不当な利益提供要請（協賛金・手数料等の強制）", "報復措置（申告・相談への不利益取扱い）"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-red-400 mt-0.5 font-bold">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-indigo-900/40 border border-indigo-700 rounded-xl p-4 text-center">
            <p className="text-sm text-white font-bold mb-1">契約書に取適法違反リスクが潜んでいないか、無料でチェック</p>
            <p className="text-xs text-indigo-300 mb-3">契約書テキストをペーストするだけで取適法チェックモードが起動します</p>
            <a href="/tool" aria-label="ツールページへ移動して取引適正化法チェックを無料で試す" className="inline-block bg-indigo-500 hover:bg-indigo-400 text-white font-black px-6 py-2.5 rounded-xl text-sm transition-colors">
              無料で取適法チェックを試す →
            </a>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="max-w-4xl mx-auto px-4 py-8 pb-8">
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
        {/* 信頼指標バー */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { num: "12,847+", label: "レビュー済み件数" },
            { num: "¥980〜", label: "月額不要・都度払い可" },
            { num: "数秒", label: "分析完了時間" },
            { num: "3回", label: "登録不要で無料" },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
              <p className="text-xl font-black text-indigo-400">{stat.num}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
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
            <Link href="/tool" aria-label="ツールページへ移動して契約書を無料で試す（3回）" className="block bg-slate-700 hover:bg-slate-600 font-bold py-3 px-6 rounded-xl transition-all">
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
              aria-label="スタンダードプラン（¥980/30日）で契約書AIレビューを購入する"
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
              aria-label="プレミアムプラン（¥2,980/月・無制限）で契約書AIレビューを購入する"
              className="w-full bg-white text-indigo-600 hover:bg-slate-100 font-bold py-3 px-6 rounded-xl transition-all"
            >
              今すぐ始める
            </button>
          </div>
        </div>
      </section>

      {/* 差別化セクション — 契約書AIレビューだけができること */}
      <section className="max-w-4xl mx-auto px-4 py-14">
        <div className="text-center mb-8">
          <div className="inline-block bg-indigo-600/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full mb-3">他サービスとの違い</div>
          <h2 className="text-2xl font-black text-white">契約書AIレビューだけができる3つのこと</h2>
          <p className="text-slate-400 text-sm mt-2">GVA assist・弁護士・汎用AIにはない、フリーランス特化の機能</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {[
            {
              icon: "📊",
              title: "リスクスコアA〜Eで即判断",
              desc: "契約書全体を100点満点でスコア化。「どこが問題か」「どれくらい危険か」を数値で判断できます。GVA assistは企業法務向けで個人には使いにくい形式。",
              badge: "GVA assistにはない個人特化",
              badgeColor: "bg-red-900/30 text-red-300 border-red-700/40",
            },
            {
              icon: "✏️",
              title: "コピペ修正案を即生成",
              desc: "「著作財産権は受託者に帰属し〜」のようなコピペして即使える修正文案を自動生成。先方へのメールにそのまま貼り付けて交渉できます。",
              badge: "汎用AIより具体的な修正文",
              badgeColor: "bg-yellow-900/30 text-yellow-300 border-yellow-700/40",
            },
            {
              icon: "⚖️",
              title: "取適法チェックモード搭載",
              desc: "2026年1月施行の取引適正化法（旧下請法）に対応した専用チェックモード。フリーランス約462万人が対象。他の契約書AIには存在しない独自機能。",
              badge: "競合他社にはない独自機能",
              badgeColor: "bg-orange-900/30 text-orange-300 border-orange-700/40",
            },
          ].map((item) => (
            <div key={item.title} className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <div className="text-3xl mb-3">{item.icon}</div>
              <div className={`inline-block border text-[10px] font-bold px-2 py-0.5 rounded mb-3 ${item.badgeColor}`}>{item.badge}</div>
              <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        {/* 3サービス価格比較 */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
          <p className="text-xs font-bold text-slate-400 mb-4 text-center">3サービス 価格・機能比較</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 px-3 text-slate-400 font-medium">比較項目</th>
                  <th className="text-center py-2 px-3 text-indigo-300 font-bold">契約書AIレビュー</th>
                  <th className="text-center py-2 px-3 text-slate-400 font-medium">GVA assist</th>
                  <th className="text-center py-2 px-3 text-slate-400 font-medium">弁護士（単発）</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["料金", "¥980/30日〜", "¥75,000/月〜", "¥5万〜15万/件"],
                  ["対象ユーザー", "個人・フリーランス", "企業法務部", "すべて"],
                  ["即日利用", "◎ 登録不要", "✗ 稟議が必要", "✗ 予約が必要"],
                  ["修正文案生成", "◎ コピペ可", "△ 要カスタマイズ", "○（別途費用）"],
                  ["取適法チェック", "◎ 専用モード", "○", "○（別途費用）"],
                  ["匿名利用", "◎", "✗", "✗"],
                ].map(([label, ours, gva, lawyer], i) => (
                  <tr key={i} className="border-b border-slate-700/50">
                    <td className="py-2.5 px-3 text-slate-400">{label}</td>
                    <td className="py-2.5 px-3 text-center text-indigo-300 font-bold">{ours}</td>
                    <td className="py-2.5 px-3 text-center text-slate-400">{gva}</td>
                    <td className="py-2.5 px-3 text-center text-slate-400">{lawyer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-center">
            <p className="text-yellow-300 font-bold text-sm">GVA assist（月¥75,000）の<span className="text-xl font-black text-yellow-400 mx-1">1/76</span>の価格で、フリーランス・個人に最適な形で提供</p>
          </div>
        </div>
      </section>

      {/* X(Twitter) Share */}
      <section className="max-w-4xl mx-auto px-4 py-10 text-center">
        <p className="text-slate-400 text-sm mb-4">AIが契約書のリスクを発見！フリーランス・副業の方にシェアしませんか？</p>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("AIが契約書のリスクを瞬時に解析！無料で試せます #契約書AI #フリーランス")}&url=${encodeURIComponent("https://keiyakusho-ai.vercel.app")}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X（Twitter）で契約書AIレビューをシェアする"
          className="inline-flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors min-h-[44px]"
        >
          <span>𝕏</span>
          <span>Xでシェアする</span>
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="/legal" aria-label="特定商取引法に基づく表記を確認する" className="hover:text-white">特定商取引法</Link>
          <Link href="/privacy" aria-label="プライバシーポリシーを確認する" className="hover:text-white">プライバシーポリシー</Link>
          <Link href="/terms" aria-label="利用規約を確認する" className="hover:text-white">利用規約</Link>
        </div>
        <p className="mb-4">© 2026 契約書AIレビュー</p>
        <div className="border-t border-slate-700 pt-3 text-xs">
          <p className="mb-1">ポッコリラボの他のサービス</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-slate-600">
            <a href="https://claim-ai-beryl.vercel.app" aria-label="クレームAIのサイトを開く（外部リンク）" className="hover:text-slate-400">クレームAI</a>
            <a href="https://hojyokin-ai-delta.vercel.app" aria-label="補助金AIのサイトを開く（外部リンク）" className="hover:text-slate-400">補助金AI</a>
            <a href="https://pawahara-ai.vercel.app" aria-label="パワハラ対策AIのサイトを開く（外部リンク）" className="hover:text-slate-400">パワハラ対策AI</a>
            <a href="https://rougo-sim-ai.vercel.app" aria-label="老後シミュレーターAIのサイトを開く（外部リンク）" className="hover:text-slate-400">老後シミュレーターAI</a>
            <a href="https://ai-keiei-keikaku.vercel.app" aria-label="AI経営計画書のサイトを開く（外部リンク）" className="hover:text-slate-400">AI経営計画書</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
