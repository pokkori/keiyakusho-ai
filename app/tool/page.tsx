"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import PayjpModal from "@/components/PayjpModal";

const FREE_LIMIT = 3;
const KEY = "keiyakusho_count";

type Section = { title: string; icon: string; content: string };
type ParsedResult = { sections: Section[]; raw: string };

function parseResult(text: string): ParsedResult {
  const sectionDefs = [
    { key: "総合評価", icon: "📊" },
    { key: "問題条項", icon: "⚠️" },
    { key: "有利不利", icon: "⚖️" },
    { key: "修正提案", icon: "✏️" },
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
  if (sections.length === 0) sections.push({ title: "レビュー結果", icon: "📄", content: text });
  return { sections, raw: text };
}

function Paywall({ onClose, onOpenPayjp }: { onClose: () => void; onOpenPayjp: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center">
        <div className="text-3xl mb-3">📋</div>
        <h2 className="text-lg font-bold mb-2">無料レビュー回数を使い切りました</h2>
        <p className="text-sm text-gray-500 mb-4">プレミアムプランで無制限に契約書をチェックできます</p>
        <ul className="text-xs text-gray-400 text-left mb-5 space-y-1">
          <li>✓ 契約書レビュー無制限</li>
          <li>✓ 4タブ詳細分析（総合評価/問題条項/有利不利/修正提案）</li>
          <li>✓ 修正文案をそのままコピー</li>
          <li>✓ いつでもキャンセル可能</li>
        </ul>
        <button onClick={onOpenPayjp} className="block w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 mb-3">
          ¥2,980/月で始める
        </button>
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
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1 flex-wrap">
        {parsed.sections.map((s, i) => (
          <button key={i} onClick={() => setActiveTab(i)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === i ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            <span>{s.icon}</span><span>{s.title}</span>
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
      </div>
    </div>
  );
}

export default function KeiyakushoTool() {
  const [contractText, setContractText] = useState("");
  const [parsed, setParsed] = useState<ParsedResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showPayjp, setShowPayjp] = useState(false);
  const [error, setError] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    setCount(parseInt(localStorage.getItem(KEY) || "0"));
    fetch("/api/auth/status").then(r => r.json()).then(d => setIsPremium(d.premium));
  }, []);

  const isLimit = !isPremium && count >= FREE_LIMIT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimit) { setShowPaywall(true); return; }
    setLoading(true); setParsed(null); setError("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractText }),
      });
      if (res.status === 429) { setShowPaywall(true); setLoading(false); return; }
      const data = await res.json();
      if (!res.ok) { setError(data.error || "エラーが発生しました"); setLoading(false); return; }
      const newCount = data.count ?? count + 1;
      localStorage.setItem(KEY, String(newCount));
      setCount(newCount);
      setParsed(parseResult(data.result || ""));
      if (!isPremium && newCount >= FREE_LIMIT) setTimeout(() => setShowPaywall(true), 1500);
    } catch { setError("通信エラーが発生しました。"); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {showPayjp && (
        <PayjpModal
          publicKey={process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY!}
          planLabel="契約書AIレビュー プレミアム ¥2,980/月（いつでもキャンセル可）"
          onSuccess={() => { setShowPayjp(false); setShowPaywall(false); setIsPremium(true); }}
          onClose={() => setShowPayjp(false)}
        />
      )}
      {showPaywall && <Paywall onClose={() => setShowPaywall(false)} onOpenPayjp={() => { setShowPaywall(false); setShowPayjp(true); }} />}
      <nav className="bg-white border-b px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-slate-900">📋 契約書AIレビュー</Link>
          <span className={`text-xs px-3 py-1 rounded-full ${isPremium ? "bg-indigo-100 text-indigo-600" : isLimit ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
            {isPremium ? "プレミアム" : isLimit ? "無料枠終了" : `無料あと${FREE_LIMIT - count}回`}
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">契約書を貼り付けてください</h1>
            <p className="text-sm text-gray-500 mt-1">全文またはチェックしたい条項をそのまま貼り付けてください。AIが4つの視点で分析します。</p>
          </div>

          <textarea
            value={contractText}
            onChange={e => setContractText(e.target.value)}
            rows={14}
            required
            placeholder={"例:\n第1条（委託業務）\n甲は乙に対し、以下の業務を委託する。\n...\n\n第2条（委託料）\n乙の業務に対する委託料は月額〇〇円とする。\n..."}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono"
          />
          <p className="text-xs text-gray-400">{contractText.length.toLocaleString()}文字 入力済み</p>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-xs text-indigo-800">
            ⚠️ <strong>免責事項</strong>：このレビューはAIによる参考情報です。法的効力はありません。重要な契約は必ず弁護士にご相談ください。
          </div>

          <button type="submit" disabled={loading || !contractText.trim()}
            className={`w-full font-bold py-3 rounded-lg text-white transition-colors ${isLimit ? "bg-orange-500 hover:bg-orange-600" : "bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300"}`}>
            {loading ? "分析中..." : isLimit ? "プレミアムで無制限にチェック" : "契約書をAIレビュー（無料）"}
          </button>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </form>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2">レビュー結果</label>
          {loading ? (
            <div className="flex-1 bg-white border border-gray-200 rounded-xl flex items-center justify-center min-h-[420px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 font-medium">契約書を分析しています...</p>
                <p className="text-xs text-gray-400 mt-2">📊 総合評価 → ⚠️ 問題条項 → ✏️ 修正提案</p>
              </div>
            </div>
          ) : parsed ? (
            <ResultTabs parsed={parsed} />
          ) : (
            <div className="flex-1 bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center min-h-[420px] gap-3">
              <div className="text-4xl">📋</div>
              <p className="text-sm text-center font-medium text-gray-500">契約書を貼り付けて<br />「AIレビュー」を押してください</p>
              <div className="bg-gray-50 rounded-lg p-4 text-xs space-y-2 w-full max-w-[260px]">
                <p className="font-semibold text-gray-600">4つの視点で分析：</p>
                <p className="text-gray-500">📊 総合評価（リスクレベルA〜E）</p>
                <p className="text-gray-500">⚠️ 問題条項（場所と理由を明示）</p>
                <p className="text-gray-500">⚖️ 有利不利（交渉ポイント整理）</p>
                <p className="text-gray-500">✏️ 修正提案（コピーしてすぐ使える）</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="text-center py-6 text-xs text-gray-400 border-t mt-4 space-x-4">
        <a href="/legal" className="hover:text-gray-600">特定商取引法に基づく表記</a>
        <span>·</span>
        <a href="/privacy" className="hover:text-gray-600">プライバシーポリシー</a>
      </footer>
    </main>
  );
}
