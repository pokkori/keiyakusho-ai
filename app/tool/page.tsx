"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const FREE_LIMIT = 3;
const KEY = "hojyokin_count";
const PREFECTURES = ["北海道","青森","岩手","宮城","秋田","山形","福島","茨城","栃木","群馬","埼玉","千葉","東京","神奈川","新潟","富山","石川","福井","山梨","長野","岐阜","静岡","愛知","三重","滋賀","京都","大阪","兵庫","奈良","和歌山","鳥取","島根","岡山","広島","山口","徳島","香川","愛媛","高知","福岡","佐賀","長崎","熊本","大分","宮崎","鹿児島","沖縄"];

async function startCheckout(plan: string) {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan }),
  });
  const { url } = await res.json();
  if (url) window.location.href = url;
}

function Paywall({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center">
        <div className="text-3xl mb-3">💰</div>
        <h2 className="text-lg font-bold mb-2">無料診断回数を使い切りました</h2>
        <p className="text-sm text-gray-500 mb-5">引き続きご利用いただくには有料プランをご選択ください</p>
        <div className="space-y-3 mb-4">
          <button onClick={() => startCheckout("standard")} className="block w-full bg-amber-500 text-white font-bold py-3 rounded-xl hover:bg-amber-600">スタンダード ¥4,980/月</button>
          <button onClick={() => startCheckout("business")} className="block w-full bg-gray-100 text-gray-700 py-3 rounded-xl text-sm hover:bg-gray-200">ビジネス ¥9,800/月</button>
        </div>
        <button onClick={onClose} className="text-xs text-gray-400">閉じる</button>
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
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => { setCount(parseInt(localStorage.getItem(KEY) || "0")); }, []);
  const isLimit = count >= FREE_LIMIT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimit) { setShowPaywall(true); return; }
    setLoading(true); setResult("");
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isIndividual, businessType, employees, prefecture, purpose }) });
      if (res.status === 429) { setShowPaywall(true); setLoading(false); return; }
      const data = await res.json();
      if (!res.ok) { setResult(data.error || "エラーが発生しました"); setLoading(false); return; }
      const newCount = data.count ?? count + 1;
      localStorage.setItem(KEY, String(newCount));
      setCount(newCount);
      setResult(data.result || "生成に失敗しました");
      if (newCount >= FREE_LIMIT) setTimeout(() => setShowPaywall(true), 1500);
    } catch { setResult("通信エラーが発生しました。インターネット接続を確認してください。"); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {showPaywall && <Paywall onClose={() => setShowPaywall(false)} />}
      <nav className="bg-white border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-gray-900">💰 AI補助金診断</Link>
          <span className={`text-xs px-3 py-1 rounded-full ${isLimit ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>
            {isLimit ? "無料枠終了" : `無料あと${FREE_LIMIT - count}回`}
          </span>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-xl font-bold text-gray-900">あなたの情報を入力</h1>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">事業形態</label>
            <div className="flex gap-3">
              {[{ label: "法人・個人事業主", val: false }, { label: "個人（一般）", val: true }].map(opt => (
                <button key={opt.label} type="button" onClick={() => setIsIndividual(opt.val)} className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${isIndividual === opt.val ? "bg-amber-500 text-white border-amber-500" : "bg-white text-gray-700 border-gray-300"}`}>{opt.label}</button>
              ))}
            </div>
          </div>
          {!isIndividual && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">業種</label>
                <input type="text" value={businessType} onChange={e => setBusinessType(e.target.value)} placeholder="例: 飲食業・IT・製造業・小売業" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">従業員数</label>
                <input type="number" value={employees} onChange={e => setEmployees(e.target.value)} placeholder="例: 5" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">都道府県</label>
            <select value={prefecture} onChange={e => setPrefecture(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
              {PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">何に使いたいか・やりたいこと <span className="text-red-500">*</span></label>
            <textarea value={purpose} onChange={e => setPurpose(e.target.value)} rows={5} placeholder="例: 店舗のITシステムを導入したい&#10;例: 設備を新しくして生産性を上げたい&#10;例: 省エネ設備に切り替えたい&#10;例: 自宅をリフォームしたい" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" required />
          </div>
          <button type="submit" disabled={loading} className={`w-full font-medium py-3 rounded-lg text-white transition-colors ${isLimit ? "bg-orange-500 hover:bg-orange-600" : "bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300"}`}>
            {loading ? "診断中..." : isLimit ? "有料プランに申し込む" : "補助金を診断する"}
          </button>
        </form>

        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">診断結果・申請書ドラフト</label>
            {result && <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-amber-600 font-medium">{copied ? "コピーしました!" : "コピー"}</button>}
          </div>
          <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-full"><div className="text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-3" /><p className="text-sm text-gray-400">AIが補助金を診断しています...</p></div></div>
            ) : result ? (
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">{result}</pre>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400"><p className="text-sm text-center">情報を入力して<br />「補助金を診断する」を押してください</p></div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
