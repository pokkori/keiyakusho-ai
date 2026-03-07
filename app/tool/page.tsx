"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const FREE_LIMIT = 3;
const KEY = "hojyokin_count";
const PREFECTURES = ["北海道","青森","岩手","宮城","秋田","山形","福島","茨城","栃木","群馬","埼玉","千葉","東京","神奈川","新潟","富山","石川","福井","山梨","長野","岐阜","静岡","愛知","三重","滋賀","京都","大阪","兵庫","奈良","和歌山","鳥取","島根","岡山","広島","山口","徳島","香川","愛媛","高知","福岡","佐賀","長崎","熊本","大分","宮崎","鹿児島","沖縄"];

type Section = { title: string; icon: string; content: string };
type ParsedResult = { sections: Section[]; raw: string };

function parseResult(text: string): ParsedResult {
  const sectionDefs = [
    { key: "申請可能な補助金", icon: "🎯" },
    { key: "申請書ドラフト", icon: "📝" },
    { key: "申請要件チェックリスト", icon: "✅" },
    { key: "採択率を上げる", icon: "📈" },
    { key: "よくある落選理由", icon: "⚠️" },
  ];
  const sections: Section[] = [];
  const parts = text.split(/^---$/m);
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const matched = sectionDefs.find(s => trimmed.includes(s.key));
    if (matched) {
      const content = trimmed.replace(/^##\s.*$/m, "").trim();
      sections.push({ title: matched.key, icon: matched.icon, content });
    }
  }
  if (sections.length === 0) sections.push({ title: "診断結果", icon: "📄", content: text });
  return { sections, raw: text };
}

async function startCheckout(plan: string) {
  const res = await fetch("/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan }) });
  const { url } = await res.json();
  if (url) window.location.href = url;
}

function Paywall({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center">
        <div className="text-3xl mb-3">💰</div>
        <h2 className="text-lg font-bold mb-2">無料診断回数を使い切りました</h2>
        <p className="text-sm text-gray-500 mb-1">申請書ドラフトをそのまま提出できるレベルで生成</p>
        <ul className="text-xs text-gray-400 text-left mb-5 space-y-1 mt-3">
          <li>✓ 補助金5件の優先度付き診断（採択率順）</li>
          <li>✓ 申請書ドラフト自動生成（提出ベース）</li>
          <li>✓ 申請要件チェックリスト付き</li>
          <li>✓ 採択率を上げる具体的アドバイス</li>
          <li>✓ 印刷・PDF保存してそのまま使える</li>
        </ul>
        <div className="space-y-3 mb-4">
          <button onClick={() => startCheckout("one_time")} className="block w-full bg-amber-500 text-white font-bold py-3 rounded-xl hover:bg-amber-600">
            <span className="text-base">¥2,980</span>
            <span className="text-sm font-normal ml-1">で今回の申請を完成させる（1回限り）</span>
          </button>
          <button onClick={() => startCheckout("standard")} className="block w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm hover:bg-gray-200">
            月額プラン ¥4,980/月（複数申請・何度でも）
          </button>
        </div>
        <p className="text-xs text-gray-400 mb-3">行政書士に頼むと10〜30万円。AIなら¥2,980で今すぐ。</p>
        <button onClick={onClose} className="text-xs text-gray-400">閉じる</button>
      </div>
    </div>
  );
}

function CopyButton({ text, label = "コピー" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium transition-colors">
      {copied ? "✓ コピー済み" : label}
    </button>
  );
}

function ResultTabs({ parsed }: { parsed: ParsedResult }) {
  const [activeTab, setActiveTab] = useState(0);
  const section = parsed.sections[activeTab];

  const handlePrint = () => {
    const html = `<html><head><title>補助金診断結果</title><style>body{font-family:sans-serif;padding:32px;line-height:1.8;white-space:pre-wrap;}</style></head><body>${parsed.raw.replace(/</g, "&lt;")}</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    w?.addEventListener("load", () => { w.print(); URL.revokeObjectURL(url); });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1 flex-wrap">
        {parsed.sections.map((s, i) => (
          <button key={i} onClick={() => setActiveTab(i)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === i ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            <span>{s.icon}</span><span className="hidden sm:inline">{s.title}</span>
          </button>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 min-h-[360px]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">{section.icon} {section.title}</span>
          <CopyButton text={section.content} />
        </div>
        <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">{section.content}</pre>
      </div>
      <div className="flex gap-2 justify-end">
        <CopyButton text={parsed.raw} label="全文コピー" />
        <button onClick={handlePrint} className="text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium">
          印刷・PDF保存
        </button>
      </div>
    </div>
  );
}

export default function HojyokinTool() {
  const [isIndividual, setIsIndividual] = useState(false);
  const [businessType, setBusinessType] = useState("");
  const [employees, setEmployees] = useState("");
  const [prefecture, setPrefecture] = useState("東京");
  const [purpose, setPurpose] = useState("");
  const [parsed, setParsed] = useState<ParsedResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { setCount(parseInt(localStorage.getItem(KEY) || "0")); }, []);
  const isLimit = count >= FREE_LIMIT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimit) { setShowPaywall(true); return; }
    setLoading(true); setParsed(null); setError("");
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isIndividual, businessType, employees, prefecture, purpose }) });
      if (res.status === 429) { setShowPaywall(true); setLoading(false); return; }
      const data = await res.json();
      if (!res.ok) { setError(data.error || "エラーが発生しました"); setLoading(false); return; }
      const newCount = data.count ?? count + 1;
      localStorage.setItem(KEY, String(newCount));
      setCount(newCount);
      setParsed(parseResult(data.result || ""));
      if (newCount >= FREE_LIMIT) setTimeout(() => setShowPaywall(true), 1500);
    } catch { setError("通信エラーが発生しました。インターネット接続を確認してください。"); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {showPaywall && <Paywall onClose={() => setShowPaywall(false)} />}
      <nav className="bg-white border-b px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-gray-900">💰 AI補助金診断</Link>
          <span className={`text-xs px-3 py-1 rounded-full ${isLimit ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>
            {isLimit ? "無料枠終了" : `無料あと${FREE_LIMIT - count}回`}
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">あなたの情報を入力</h1>
            <p className="text-sm text-gray-500 mt-1">入力情報から申請可能な補助金を診断し、申請書ドラフトまで自動生成します。</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">事業形態</label>
            <div className="flex gap-3">
              {[{ label: "法人・個人事業主", val: false }, { label: "個人（一般）", val: true }].map(opt => (
                <button key={opt.label} type="button" onClick={() => setIsIndividual(opt.val)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${isIndividual === opt.val ? "bg-amber-500 text-white border-amber-500" : "bg-white text-gray-700 border-gray-300 hover:border-amber-400"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {!isIndividual && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">業種</label>
                <input type="text" value={businessType} onChange={e => setBusinessType(e.target.value)}
                  placeholder="例: 飲食業・IT・製造業・小売業・建設業"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">従業員数</label>
                <input type="number" value={employees} onChange={e => setEmployees(e.target.value)}
                  placeholder="例: 5"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">都道府県</label>
            <select value={prefecture} onChange={e => setPrefecture(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
              {PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">何に使いたいか・やりたいこと <span className="text-red-500">*</span></label>
            <textarea value={purpose} onChange={e => setPurpose(e.target.value)} rows={5} required
              placeholder={"例:\n・店舗にPOSレジシステムを導入したい\n・設備を新しくして生産性を上げたい\n・省エネ設備に切り替えたい\n・ECサイトを立ち上げたい"}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
            <p className="text-xs text-gray-400 mt-1">詳しく書くほど精度が上がります（{purpose.length}/1000文字）</p>
          </div>

          <button type="submit" disabled={loading}
            className={`w-full font-bold py-3 rounded-lg text-white transition-colors ${isLimit ? "bg-orange-500 hover:bg-orange-600" : "bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300"}`}>
            {loading ? "診断中..." : isLimit ? "¥2,980で申請書を完成させる" : "補助金を診断する（無料）"}
          </button>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </form>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2">診断結果</label>
          {loading ? (
            <div className="flex-1 bg-white border border-gray-200 rounded-xl flex items-center justify-center min-h-[420px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-3" />
                <p className="text-sm text-gray-500 font-medium">AIが補助金を診断しています...</p>
                <p className="text-xs text-gray-400 mt-2">🎯 補助金5件 → 📝 申請書ドラフト → ✅ チェックリスト</p>
                <p className="text-xs text-gray-300 mt-1">通常20〜30秒かかります</p>
              </div>
            </div>
          ) : parsed ? (
            <ResultTabs parsed={parsed} />
          ) : (
            <div className="flex-1 bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center min-h-[420px] gap-3">
              <div className="text-4xl">💰</div>
              <p className="text-sm text-center font-medium text-gray-500">情報を入力して<br />「補助金を診断する」を押してください</p>
              <div className="bg-gray-50 rounded-lg p-4 text-xs space-y-2 w-full max-w-[260px]">
                <p className="font-semibold text-gray-600">生成される内容：</p>
                <p className="text-gray-500">🎯 申請可能な補助金（優先度順5件）</p>
                <p className="text-gray-500">📝 申請書ドラフト（提出ベース）</p>
                <p className="text-gray-500">✅ 申請要件チェックリスト</p>
                <p className="text-gray-500">📈 採択率を上げる3つのポイント</p>
                <p className="text-gray-500">⚠️ よくある落選理由と対策</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="text-center py-6 text-xs text-gray-400 border-t mt-4 space-x-4">
        <a href="/legal" className="hover:text-gray-600">特定商取引法に基づく表記</a>
        <a href="/privacy" className="hover:text-gray-600">プライバシーポリシー</a>
      </footer>
    </main>
  );
}
