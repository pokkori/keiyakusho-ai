"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import PayjpModal from "@/components/PayjpModal";
import { track } from '@vercel/analytics';

const FREE_LIMIT = 3;
const KEY = "keiyakusho_count";

type Section = { title: string; icon: string; content: string };
type ParsedResult = { sections: Section[]; raw: string };

const CHECK_MODES = [
  { id: "standard", label: "通常レビュー", desc: "一般的な契約書リスクチェック" },
  { id: "toitekihou", label: "取適法チェック ★", desc: "取引適正化法（旧下請法）違反リスク判定 — 2026年1月施行対応", badge: "NEW" },
] as const;
type CheckModeId = typeof CHECK_MODES[number]["id"];

const PARTY_ROLES = [
  { id: "consignor", label: "委託者（発注側）" },
  { id: "consignee", label: "受託者（受注側）" },
] as const;
type PartyRoleId = typeof PARTY_ROLES[number]["id"];

function renderMarkdown(text: string) {
  const lines = text.split('\n');
  const result: string[] = [];
  let inList = false;

  for (const line of lines) {
    if (/^## (.+)$/.test(line)) {
      if (inList) { result.push('</ul>'); inList = false; }
      result.push(line.replace(/^## (.+)$/, '<h3 class="font-bold text-base mt-4 mb-2 text-indigo-700 border-b border-indigo-200 pb-1">$1</h3>'));
    } else if (/^# (.+)$/.test(line)) {
      if (inList) { result.push('</ul>'); inList = false; }
      result.push(line.replace(/^# (.+)$/, '<h2 class="font-bold text-lg mt-4 mb-2 text-indigo-800">$1</h2>'));
    } else if (/^- (.+)$/.test(line)) {
      if (!inList) { result.push('<ul class="space-y-1 mb-2">'); inList = true; }
      const inner = line.replace(/^- /, '').replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
      result.push(`<li class="ml-4 list-disc text-gray-700 text-sm">${inner}</li>`);
    } else if (/^[①②③④⑤⑥⑦⑧⑨⑩]/.test(line)) {
      if (!inList) { result.push('<ul class="space-y-1 mb-2">'); inList = true; }
      const inner = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
      result.push(`<li class="ml-4 list-disc text-gray-700 text-sm">${inner}</li>`);
    } else if (line.trim() === '') {
      if (inList) { result.push('</ul>'); inList = false; }
      result.push('<div class="mt-2"></div>');
    } else {
      if (inList) { result.push('</ul>'); inList = false; }
      const inner = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
      result.push(`<p class="text-gray-700 text-sm leading-relaxed">${inner}</p>`);
    }
  }
  if (inList) result.push('</ul>');
  return result.join('\n');
}

function parseResult(text: string): ParsedResult {
  const sectionDefs = [
    { key: "総合評価", icon: "📊" },
    { key: "問題条項", icon: "⚠️" },
    { key: "有利不利", icon: "⚖️" },
    { key: "取適法チェック", icon: "⚖️" },
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

function Paywall({ onClose, onOpenPayjp, onOpenOnce }: { onClose: () => void; onOpenPayjp: () => void; onOpenOnce: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center">
        <div className="text-3xl mb-3">📋</div>
        <h2 className="text-lg font-bold mb-2">無料レビュー回数を使い切りました</h2>
        <p className="text-sm text-gray-500 mb-4">続けて使うにはプランをお選びください</p>
        <button onClick={() => { track('upgrade_click', { service: '契約書AIレビュー', plan: 'once' }); onOpenOnce(); }} className="block w-full bg-yellow-400 text-slate-900 font-bold py-3 rounded-xl hover:bg-yellow-500 mb-3">
          今すぐ1回試す ¥980（30日間有効）
        </button>
        <ul className="text-xs text-gray-400 text-left mb-3 space-y-1 border border-gray-100 rounded-lg p-3">
          <li>✓ 契約書レビュー30日間使い放題</li>
          <li>✓ 総合評価・問題条項・修正提案</li>
          <li>✗ 有利不利タブはPremium限定</li>
        </ul>
        <button onClick={() => { track('upgrade_click', { service: '契約書AIレビュー', plan: 'premium' }); onOpenPayjp(); }} className="block w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 mb-3">
          ¥2,980/月で無制限に使う（有利不利タブ含む）
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

function useCountUp(target: number, duration = 800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    const steps = 20;
    const increment = target / steps;
    const interval = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else { setCount(Math.floor(current)); }
    }, interval);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function RiskCountBanner({ parsed }: { parsed: ParsedResult }) {
  const issueSection = parsed.sections.find(s => s.title === "問題条項");
  const riskCount = issueSection
    ? (issueSection.content.match(/危険度[：:]/g) || []).length || Math.max(1, Math.floor(issueSection.content.split("\n").filter(l => l.trim()).length / 3))
    : Math.max(1, parsed.sections.length);
  const displayCount = useCountUp(riskCount, 1000);
  return (
    <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-3 text-center">
      <p className="text-xs text-red-600 font-bold mb-1">AIが発見したリスク件数</p>
      <p className="text-5xl font-black text-red-600">{displayCount}<span className="text-2xl font-normal ml-1">件</span></p>
      <p className="text-xs text-gray-500 mt-1">詳細は「問題条項」タブで確認できます</p>
    </div>
  );
}

function XShareButton({ parsed }: { parsed: ParsedResult }) {
  const issueSection = parsed.sections.find(s => s.title === "問題条項");
  const riskCount = issueSection
    ? (issueSection.content.match(/危険度[：:]/g) || []).length || Math.max(1, Math.floor(issueSection.content.split("\n").filter(l => l.trim()).length / 3))
    : parsed.sections.length;
  const shareText = `「契約書に${riskCount}件のリスク条項が潜んでた😱 署名前に気づいてよかった。弁護士費用ゼロで発見できた → https://keiyakusho-ai.vercel.app #契約書 #フリーランス #AI法務 #副業`;
  const shareUrl = "https://keiyakusho-ai.vercel.app";
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  return (
    <a
      href={tweetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors"
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      Xでシェアする
    </a>
  );
}

function ResultTabs({ parsed, isPremium, onUpgrade }: { parsed: ParsedResult; isPremium: boolean; onUpgrade: () => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const section = parsed.sections[activeTab];
  const isAdvantageTab = section.title === "有利不利";
  return (
    <div className="flex flex-col gap-3">
      <RiskCountBanner parsed={parsed} />
      <div className="flex gap-1 flex-wrap">
        {parsed.sections.map((s, i) => {
          const locked = !isPremium && s.title === "有利不利";
          return (
            <button key={i} onClick={() => setActiveTab(i)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === i ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              <span>{s.icon}</span><span>{s.title}</span>{locked && <span>🔒</span>}
            </button>
          );
        })}
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 min-h-[360px]">
        {!isPremium && isAdvantageTab ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
            <span className="text-4xl">🔒</span>
            <p className="text-sm font-semibold text-gray-700">有利不利タブはPremium限定</p>
            <p className="text-xs text-gray-500 text-center">交渉すべきポイント・有利不利の整理は<br />プレミアムプランでご利用いただけます</p>
            <button onClick={onUpgrade} className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-indigo-700">
              プレミアムにアップグレード →
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">{section.icon} {section.title}</span>
              <CopyButton text={section.content} />
            </div>
            <div className="text-sm" dangerouslySetInnerHTML={{ __html: renderMarkdown(section.content) }} />
          </>
        )}
      </div>
      <div className="flex items-center gap-2 justify-end">
        <XShareButton parsed={parsed} />
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
  const [showPayjpOnce, setShowPayjpOnce] = useState(false);
  const [error, setError] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [checkMode, setCheckMode] = useState<CheckModeId>("standard");
  const [partyRole, setPartyRole] = useState<PartyRoleId>("consignee");

  useEffect(() => {
    setCount(parseInt(localStorage.getItem(KEY) || "0"));
    fetch("/api/auth/status").then(r => r.json()).then(d => setIsPremium(d.premium));
  }, []);

  const isLimit = !isPremium && count >= FREE_LIMIT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimit) { track('paywall_shown', { service: '契約書AIレビュー' }); setShowPaywall(true); return; }
    track('ai_generated', { service: '契約書AIレビュー' });
    setLoading(true); setParsed(null); setError("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractText, checkMode, partyRole }),
      });
      if (res.status === 429) { track('paywall_shown', { service: '契約書AIレビュー' }); setShowPaywall(true); setLoading(false); return; }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "エラーが発生しました"); setLoading(false); return;
      }
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (chunk.includes("\nDONE:")) {
          const idx = chunk.indexOf("\nDONE:");
          accumulated += chunk.slice(0, idx);
          try {
            const meta = JSON.parse(chunk.slice(idx + 6));
            const newCount = meta.count ?? count + 1;
            localStorage.setItem(KEY, String(newCount));
            setCount(newCount);
            if (!isPremium && newCount >= FREE_LIMIT) setTimeout(() => { track('paywall_shown', { service: '契約書AIレビュー' }); setShowPaywall(true); }, 1500);
          } catch { /* ignore */ }
        } else {
          accumulated += chunk;
        }
        setParsed(parseResult(accumulated));
      }
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
      {showPayjpOnce && (
        <PayjpModal
          publicKey={process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY!}
          planLabel="1回払い ¥980 — 30日間有効（契約書レビュー使い放題）"
          apiPath="/api/payjp/charge"
          onSuccess={() => { setShowPayjpOnce(false); setShowPaywall(false); setIsPremium(true); }}
          onClose={() => setShowPayjpOnce(false)}
        />
      )}
      {showPaywall && (
        <Paywall
          onClose={() => setShowPaywall(false)}
          onOpenPayjp={() => { setShowPaywall(false); setShowPayjp(true); }}
          onOpenOnce={() => { setShowPaywall(false); setShowPayjpOnce(true); }}
        />
      )}
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

          {/* チェックモード選択 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-slate-600">チェックモード</p>
            <div className="flex flex-col gap-2">
              {CHECK_MODES.map(mode => (
                <label key={mode.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${checkMode === mode.id ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-indigo-300"}`}>
                  <input type="radio" name="checkMode" value={mode.id} checked={checkMode === mode.id} onChange={() => setCheckMode(mode.id)} className="mt-0.5 accent-indigo-600" />
                  <div>
                    <span className="text-sm font-semibold text-slate-800">{mode.label}</span>
                    {"badge" in mode && <span className="ml-2 inline-block bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{mode.badge}</span>}
                    <p className="text-xs text-slate-500 mt-0.5">{mode.desc}</p>
                  </div>
                </label>
              ))}
            </div>
            {checkMode === "toitekihou" && (
              <div className="mt-2 pt-3 border-t border-slate-200">
                <p className="text-xs font-semibold text-slate-600 mb-2">あなたの立場</p>
                <div className="flex gap-3">
                  {PARTY_ROLES.map(role => (
                    <label key={role.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-xs font-medium transition-colors ${partyRole === role.id ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600 hover:border-indigo-300"}`}>
                      <input type="radio" name="partyRole" value={role.id} checked={partyRole === role.id} onChange={() => setPartyRole(role.id)} className="accent-indigo-600" />
                      {role.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <textarea
            value={contractText}
            onChange={e => setContractText(e.target.value)}
            rows={14}
            required
            placeholder={"例:\n第1条（委託業務）\n甲は乙に対し、以下の業務を委託する。\n...\n\n第2条（委託料）\n乙の業務に対する委託料は月額〇〇円とする。\n..."}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono"
          />
          <p className="text-xs text-gray-400">
            {contractText.length.toLocaleString()}文字 入力済み
            {contractText.length > 8000 && (
              <span className="ml-2 text-orange-500 font-medium">※ 8,000文字を超えた部分は分析対象外となります</span>
            )}
          </p>
          <p className="text-xs text-gray-400">※ 最大8,000文字まで対応（長い契約書は分割してご利用ください）</p>

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
                <p className="text-xs text-gray-400 mt-2">
                  {checkMode === "toitekihou"
                    ? "📊 総合評価 → ⚠️ 問題条項 → ⚖️ 取適法チェック → ✏️ 修正提案"
                    : "📊 総合評価 → ⚠️ 問題条項 → ✏️ 修正提案"}
                </p>
              </div>
            </div>
          ) : parsed ? (
            <>
              <ResultTabs parsed={parsed} isPremium={isPremium} onUpgrade={() => setShowPaywall(true)} />
              {/* 次のアクション3選 */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mt-4">
                <p className="text-sm font-bold text-indigo-800 mb-3">📋 次にやるべきこと3選</p>
                <ol className="space-y-2">
                  {[
                    { icon: "✏️", text: "「修正提案」タブの内容をコピーして先方に修正依頼を出す" },
                    { icon: "💬", text: "リスクが高い条項は弁護士ドットコムで専門家に相談する" },
                    { icon: "📁", text: "契約書と今回の分析結果を同じフォルダに保存して記録を残す" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="text-lg leading-none">{item.icon}</span>
                      <span>{i + 1}. {item.text}</span>
                    </li>
                  ))}
                </ol>
              </div>
              {/* 契約後の会計・経費管理アフィリエイト */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4">
                <p className="text-sm font-bold text-green-800 mb-1">💼 契約後の会計・経費管理に</p>
                <p className="text-xs text-green-700 mb-3">契約締結後は請求書・経費・確定申告の管理も重要。クラウド会計で一括管理しましょう。</p>
                <a
                  href="https://px.a8.net/svt/ejp?a8mat=4AZIOF+3LSINM+3SPO+9FDPYR"
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex items-center justify-between bg-white border border-green-300 rounded-xl px-4 py-3 hover:bg-green-50 transition-colors"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-800">freee会計 — 請求書・確定申告をまとめて管理</div>
                    <div className="text-xs text-slate-500 mt-0.5">フリーランス・中小企業向け • 初月無料で試せる</div>
                  </div>
                  <span className="text-green-700 font-bold text-xs bg-green-100 px-2 py-1 rounded-full">無料で試す →</span>
                </a>
                <p className="text-xs text-slate-400 text-center mt-2">※ 広告・PR掲載（公式サイトに遷移します）</p>
              </div>
            </>
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

      {/* 弁護士相談アフィリエイト（A8.net申請後URLを差し替え） */}
      <div className="max-w-2xl mx-auto px-4 pb-6">
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
          <p className="text-sm font-black text-indigo-900 mb-1">⚖️ 弁護士に契約書を確認してもらう</p>
          <p className="text-xs text-indigo-700 mb-4">AIレビューで問題点を把握したら、重要な契約は弁護士の最終確認で安心。初回相談無料の事務所多数。</p>
          <div className="space-y-2">
            {/* TODO: Replace href with A8.net affiliate URL after approval */}
            <a href="https://www.bengo4.com/c_1009/" target="_blank" rel="noopener noreferrer sponsored"
              className="flex items-center justify-between bg-white border border-indigo-300 rounded-xl px-4 py-3 hover:bg-indigo-50 transition-colors">
              <div>
                <div className="text-sm font-bold text-slate-800">弁護士ドットコム — 契約書・法務</div>
                <div className="text-xs text-slate-500 mt-0.5">初回相談無料 • フリーランス・中小企業向け</div>
              </div>
              <span className="text-indigo-600 font-bold text-xs bg-indigo-100 px-2 py-1 rounded-full">無料相談 →</span>
            </a>
            {/* TODO: Replace href with A8.net affiliate URL after approval */}
            <a href="https://www.legal-mall.com/s/keiyaku" target="_blank" rel="noopener noreferrer sponsored"
              className="flex items-center justify-between bg-white border border-indigo-300 rounded-xl px-4 py-3 hover:bg-indigo-50 transition-colors">
              <div>
                <div className="text-sm font-bold text-slate-800">ベンナビ — 契約書トラブル専門</div>
                <div className="text-xs text-slate-500 mt-0.5">地域・費用で絞り込み • 報酬の目安を事前確認</div>
              </div>
              <span className="text-indigo-600 font-bold text-xs bg-indigo-100 px-2 py-1 rounded-full">弁護士を探す →</span>
            </a>
          </div>
          <p className="text-xs text-slate-400 text-center mt-3">※ 広告・PR掲載（各社公式サイトに遷移します）</p>
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
