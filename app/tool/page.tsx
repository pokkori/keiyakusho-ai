"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import KomojuButton from "@/components/KomojuButton";
import { track } from '@vercel/analytics';
import { updateStreak, loadStreak, getStreakMilestoneMessage, type StreakData } from "@/lib/streak";

const FREE_LIMIT = 3;
const KEY = "keiyakusho_count";
const HISTORY_KEY = "keiyakusho_history";
const MAX_HISTORY = 5;
const REVIEW_HISTORY_KEY = "keiyakusho_review_history";
const MAX_REVIEW_HISTORY = 10;

type Section = { title: string; icon: string; content: string };
type ParsedResult = { sections: Section[]; raw: string };
type HistoryItem = { date: string; contractType: string; riskCount: number; result: string };

interface ReviewHistory {
  id: string;
  date: string;
  fileName: string;
  riskCount: number;
  summary: string;
}

// StreamingWordReveal: ストリーミング中のテキストを単語単位でフェードイン表示
function StreamingWordReveal({ text, className = "" }: { text: string; className?: string }) {
  const [revealedText, setRevealedText] = useState("");
  const [pendingWords, setPendingWords] = useState<string[]>([]);
  const prevLengthRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (text.length > prevLengthRef.current) {
      const newChunk = text.slice(prevLengthRef.current);
      prevLengthRef.current = text.length;
      const words = newChunk.split(/(\s+)/).filter(w => w.length > 0);
      setPendingWords(prev => [...prev, ...words]);
    }
  }, [text]);

  useEffect(() => {
    if (pendingWords.length === 0) return;
    if (timerRef.current) return;
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setPendingWords(prev => {
        if (prev.length === 0) return prev;
        setRevealedText(rt => rt + prev[0]);
        return prev.slice(1);
      });
    }, 15);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [pendingWords]);

  return (
    <span className={className}>
      <span>{revealedText}</span>
      {pendingWords.length > 0 && (
        <span className="animate-pulse opacity-50">{pendingWords[0]}</span>
      )}
    </span>
  );
}

function saveReviewHistory(fileName: string, riskCount: number, summary: string) {
  try {
    const existing: ReviewHistory[] = JSON.parse(localStorage.getItem(REVIEW_HISTORY_KEY) ?? "[]");
    const item: ReviewHistory = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("ja-JP"),
      fileName: fileName.slice(0, 40),
      riskCount,
      summary: summary.slice(0, 100).replace(/\n/g, " "),
    };
    localStorage.setItem(REVIEW_HISTORY_KEY, JSON.stringify([item, ...existing].slice(0, MAX_REVIEW_HISTORY)));
  } catch { /* noop */ }
}

function ReviewHistoryPanel() {
  const [history, setHistory] = useState<ReviewHistory[]>([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try { setHistory(JSON.parse(localStorage.getItem(REVIEW_HISTORY_KEY) ?? "[]")); } catch { /* noop */ }
  }, []);
  if (history.length === 0) return null;
  return (
    <div className="border border-indigo-200 rounded-xl mb-4 overflow-hidden bg-white">
      <button type="button" onClick={() => setOpen(o => !o)}
        aria-expanded={open} aria-label="過去のレビュー履歴を表示"
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-indigo-50 transition-colors text-left">
        <span className="text-sm font-bold text-indigo-800">過去のレビュー履歴（直近{history.length}件）</span>
        <span className="text-gray-400 text-xs">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <ul className="border-t border-indigo-100 divide-y divide-indigo-50">
          {history.map(h => (
            <li key={h.id} className="px-4 py-2">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-medium text-gray-700 truncate mr-2">{h.fileName}</span>
                <span className="text-xs text-gray-500 shrink-0">{h.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${h.riskCount >= 3 ? "bg-red-100 text-red-700" : h.riskCount >= 1 ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                  リスク{h.riskCount}件
                </span>
                <p className="text-xs text-gray-400 truncate">{h.summary}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// 履歴パネルコンポーネント
function HistoryPanel({ onSelect }: { onSelect: (result: string) => void }) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      setHistory(JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]"));
    } catch { /* ignore */ }
  }, [open]);

  if (history.length === 0) return null;

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label={open ? "レビュー履歴を非表示" : "過去のレビュー履歴を表示"}
        aria-expanded={open}
        className="flex items-center gap-2 text-sm font-medium text-indigo-700 hover:text-indigo-900 transition-colors"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" d="M12 6v6l4 2" />
        </svg>
        過去のレビュー履歴（{history.length}件）
        <span>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          {history.map((item, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-700 truncate">{item.contractType || "契約書"}</p>
                <p className="text-xs text-gray-400">{item.date} — リスク {item.riskCount}件</p>
              </div>
              <button
                type="button"
                onClick={() => onSelect(item.result)}
                aria-label={`${item.date}のレビュー結果を表示`}
                className="shrink-0 text-xs px-3 py-1.5 min-h-[36px] rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium transition-colors"
              >
                表示
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => { localStorage.removeItem(HISTORY_KEY); setHistory([]); }}
            aria-label="レビュー履歴を全て削除"
            className="text-xs text-gray-400 hover:text-gray-600 w-full text-center py-1"
          >
            履歴を削除
          </button>
        </div>
      )}
    </div>
  );
}

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

const CONTRACT_TYPES = [
  { id: "gyomu_itaku", label: "業務委託" },
  { id: "fudosan_chintai", label: "不動産賃貸" },
  { id: "baibai", label: "売買" },
  { id: "koyo_rodo", label: "雇用・労働" },
  { id: "nda", label: "秘密保持(NDA)" },
  { id: "franchise", label: "フランチャイズ" },
] as const;
type ContractTypeId = typeof CONTRACT_TYPES[number]["id"] | "";

// ===== サンプル契約書テキスト（入力支援用） =====
const SAMPLE_CONTRACTS: Record<string, { label: string; text: string }> = {
  gyomu_itaku: {
    label: "業務委託サンプル",
    text: `業務委託契約書

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
乙は業務上知り得た甲の業務情報を第三者に開示してはならない。本条の効力は契約終了後も永続して存続する。

第6条（損害賠償）
乙の業務上の過失により甲が損害を被った場合、乙は甲に生じた全ての損害を賠償する（上限なし）。`,
  },
  nda: {
    label: "NDAサンプル",
    text: `秘密保持契約書（NDA）

甲: 株式会社〇〇（開示側）
乙: 株式会社△△（受領側）

第1条（秘密情報の定義）
本契約において「秘密情報」とは、甲が乙に開示する技術・営業・財務に関する一切の情報をいう。

第2条（秘密保持義務）
乙は秘密情報を厳に秘密として保持し、甲の事前書面による承諾なく第三者に開示・漏洩してはならない。

第3条（有効期間）
本契約の有効期間は締結日から5年間とし、秘密保持義務は契約終了後も無期限に継続する。

第4条（損害賠償）
乙が本契約に違反した場合、乙は甲に生じた一切の損害を賠償するものとし、賠償額の上限は設けない。`,
  },
};

function SampleFillButton({ contractType, onFill }: { contractType: ContractTypeId; onFill: (text: string) => void }) {
  const sample = contractType && SAMPLE_CONTRACTS[contractType];
  if (!sample) return null;
  return (
    <button
      type="button"
      onClick={() => onFill(sample.text)}
      className="text-xs px-3 py-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold border border-orange-200 transition-colors"
    >
      {sample.label}を入力する
    </button>
  );
}

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
    { key: "総合評価", icon: "[評価]" },
    { key: "問題条項", icon: "[リスク]" },
    { key: "有利不利", icon: "[比較]" },
    { key: "取適法チェック", icon: "[取適法]" },
    { key: "修正提案", icon: "[修正案]" },
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
  if (sections.length === 0) sections.push({ title: "レビュー結果", icon: "[結果]", content: text });
  return { sections, raw: text };
}

function Paywall({ onClose, onOpenPayjp, onOpenOnce }: { onClose: () => void; onOpenPayjp: () => void; onOpenOnce: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center">
        <div className="mb-3 flex justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-10 h-10 text-indigo-500" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold mb-2">無料レビュー回数を使い切りました</h2>
        <p className="text-sm text-gray-500 mb-4">続けて使うにはプランをお選びください</p>
        <KomojuButton
          planId="standard"
          planLabel="スタンダード ¥980（30日間有効）"
          className="w-full bg-yellow-400 text-slate-900 font-bold py-3 rounded-xl hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-3"
        />
        <ul className="text-xs text-gray-400 text-left mb-3 space-y-1 border border-gray-100 rounded-lg p-3">
          <li>✓ 契約書レビュー30日間使い放題</li>
          <li>✓ 総合評価・問題条項・修正提案</li>
          <li>✗ 有利不利タブはPremium限定</li>
        </ul>
        <KomojuButton
          planId="business"
          planLabel="ビジネス ¥2,980/月（有利不利タブ含む）"
          className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-3"
        />
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
  const shareText = `「契約書に${riskCount}件のリスク条項が潜んでた😱 署名前に気づいてよかった。弁護士費用ゼロで発見できた → https://keiyaku-review.vercel.app #契約書 #フリーランス #AI法務 #副業`;
  const shareUrl = "https://keiyaku-review.vercel.app";
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
              <span>{s.icon}</span><span>{s.title}</span>{locked && <span aria-label="プレミアム限定">[P]</span>}
            </button>
          );
        })}
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 min-h-[360px]">
        {!isPremium && isAdvantageTab ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-10 h-10 text-indigo-400" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
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

type FileUploadStatus = "idle" | "reading" | "success" | "error";

function FileUploadSection({ onTextExtracted }: { onTextExtracted: (text: string) => void }) {
  const [status, setStatus] = useState<FileUploadStatus>("idle");
  const [fileName, setFileName] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromFile = async (file: File) => {
    setStatus("reading");
    setFileName(file.name);
    setErrorMsg("");

    try {
      // テキストファイル・Word .docx（プレーンテキストとして試みる）
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        const text = await file.text();
        onTextExtracted(text);
        setStatus("success");
        return;
      }

      // PDF: FileReader でバイナリ読み込み → テキスト部分を抽出
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        // PDFバイナリからBT...ETブロック内のテキストを抽出する簡易パーサー
        let pdfText = "";
        const decoder = new TextDecoder("latin1");
        const rawStr = decoder.decode(bytes);

        // BT (Begin Text) ... ET (End Text) ブロック内のTj/TJオペレータからテキストを拾う
        const btEtRegex = /BT([\s\S]*?)ET/g;
        let btMatch;
        while ((btMatch = btEtRegex.exec(rawStr)) !== null) {
          const block = btMatch[1];
          // (テキスト) Tj または [(テキスト)] TJ パターン
          const tjRegex = /\(((?:[^()\\]|\\.)*)\)\s*Tj/g;
          const tjArrayRegex = /\[((?:[^\[\]]*\([^)]*\)[^\[\]]*)*)\]\s*TJ/g;
          let tjMatch;
          while ((tjMatch = tjRegex.exec(block)) !== null) {
            pdfText += decodeOctalEscapes(tjMatch[1]) + " ";
          }
          while ((tjMatch = tjArrayRegex.exec(block)) !== null) {
            const inner = tjMatch[1];
            const innerTj = /\(((?:[^()\\]|\\.)*)\)/g;
            let innerMatch;
            while ((innerMatch = innerTj.exec(inner)) !== null) {
              pdfText += decodeOctalEscapes(innerMatch[1]);
            }
            pdfText += " ";
          }
        }

        // テキストが取れなかった場合はストリーム内の可読文字列をフォールバック抽出
        if (pdfText.trim().length < 50) {
          const printable = rawStr.replace(/[^\x20-\x7E\n\r\t\u3040-\u9FFF\uFF00-\uFFEF]/g, " ");
          const cleaned = printable.replace(/\s{3,}/g, "\n").trim();
          pdfText = cleaned.slice(0, 8000);
        }

        const finalText = pdfText.trim().slice(0, 8000);
        if (finalText.length < 20) {
          setStatus("error");
          setErrorMsg("PDFからテキストを取得できませんでした。テキスト選択でコピーして貼り付けてください。");
          return;
        }
        onTextExtracted(finalText);
        setStatus("success");
        return;
      }

      // .docx: ZIPベースのXML → 簡易テキスト抽出
      if (file.name.endsWith(".docx")) {
        const text = await file.text();
        // XMLタグを除去して本文を取得
        const stripped = text.replace(/<[^>]+>/g, " ").replace(/\s{2,}/g, "\n").trim();
        const finalText = stripped.slice(0, 8000);
        if (finalText.length < 10) {
          setStatus("error");
          setErrorMsg(".docxからテキストを取得できませんでした。テキストをコピーして貼り付けてください。");
          return;
        }
        onTextExtracted(finalText);
        setStatus("success");
        return;
      }

      setStatus("error");
      setErrorMsg("対応していないファイル形式です。PDF・.txt ファイルをお試しください。");
    } catch {
      setStatus("error");
      setErrorMsg("ファイルの読み込みに失敗しました。テキストをコピーして貼り付けてください。");
    }
  };

  function decodeOctalEscapes(str: string): string {
    return str.replace(/\\([0-7]{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)));
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) extractTextFromFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) extractTextFromFile(file);
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
      <p className="text-xs font-semibold text-blue-700">📁 ファイルからテキストを取り込む（任意）</p>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-100/50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
        {status === "idle" && (
          <>
            <p className="text-sm text-blue-600 font-medium">クリックまたはドラッグ&ドロップ</p>
            <p className="text-xs text-blue-400 mt-1">PDF / .txt / .docx 対応 • ファイルはサーバーに送信されません</p>
          </>
        )}
        {status === "reading" && (
          <p className="text-sm text-blue-600 animate-pulse">読み込み中...</p>
        )}
        {status === "success" && (
          <div className="flex items-center justify-center gap-2 text-green-700">
            <span className="text-lg">✓</span>
            <div className="text-left">
              <p className="text-sm font-bold">{fileName}</p>
              <p className="text-xs text-green-600">テキストを取り込みました</p>
            </div>
          </div>
        )}
        {status === "error" && (
          <div>
            <p className="text-sm text-red-600 font-medium">取り込み失敗</p>
            <p className="text-xs text-red-500 mt-1">{errorMsg}</p>
          </div>
        )}
      </div>
      {status === "success" && (
        <button
          type="button"
          onClick={() => { setStatus("idle"); setFileName(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
          className="text-xs text-blue-500 hover:text-blue-700"
        >
          別のファイルを選択
        </button>
      )}
      <p className="text-xs text-blue-400">※ テキスト選択式PDFのみ対応。スキャンPDFはコピー貼り付けをご利用ください。</p>
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
  const [contractType, setContractType] = useState<ContractTypeId>("");
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [streakMsg, setStreakMsg] = useState<string | null>(null);

  useEffect(() => {
    setCount(parseInt(localStorage.getItem(KEY) || "0"));
    fetch("/api/auth/status").then(r => r.json()).then(d => setIsPremium(d.premium));
    setStreak(loadStreak("keiyakusho"));
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
        body: JSON.stringify({ contractText, checkMode, partyRole, contractType: contractType || undefined }),
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
      // 完了後に履歴保存
      if (accumulated) {
        const finalParsed = parseResult(accumulated);
        const issueSection = finalParsed.sections.find(s => s.title === "問題条項");
        const riskCount = issueSection
          ? (issueSection.content.match(/危険度[：:]/g) || []).length || Math.max(1, Math.floor(issueSection.content.split("\n").filter(l => l.trim()).length / 3))
          : finalParsed.sections.length;
        const contractLabel = CONTRACT_TYPES.find(ct => ct.id === contractType)?.label ?? "その他";
        const newItem: HistoryItem = {
          date: new Date().toLocaleDateString("ja-JP"),
          contractType: contractLabel,
          riskCount,
          result: accumulated,
        };
        try {
          const prev: HistoryItem[] = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
          localStorage.setItem(HISTORY_KEY, JSON.stringify([newItem, ...prev].slice(0, MAX_HISTORY)));
        } catch { /* ignore */ }
        saveReviewHistory(contractLabel, riskCount, accumulated);
        // ストリーク更新
        const updatedStreak = updateStreak("keiyakusho");
        setStreak(updatedStreak);
        const msg = getStreakMilestoneMessage(updatedStreak.count);
        if (msg) setStreakMsg(msg);
      }
    } catch { setError("通信エラーが発生しました。"); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {showPayjp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl relative">
            <button type="button" onClick={() => setShowPayjp(false)} aria-label="プレミアムプランモーダルを閉じる" className="absolute top-3 right-3 text-gray-400 text-xl">✕</button>
            <h2 className="text-lg font-bold mb-4 text-center">プランに登録</h2>
            <KomojuButton planId="business" planLabel="ビジネス ¥2,980/月を始める" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50" />
          </div>
        </div>
      )}
      {showPayjpOnce && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl relative">
            <button type="button" onClick={() => setShowPayjpOnce(false)} aria-label="スタンダードプランモーダルを閉じる" className="absolute top-3 right-3 text-gray-400 text-xl">✕</button>
            <h2 className="text-lg font-bold mb-4 text-center">プランに登録</h2>
            <KomojuButton planId="standard" planLabel="スタンダード ¥980（30日間有効）を始める" className="w-full bg-yellow-400 text-slate-900 font-bold py-3 rounded-xl hover:bg-yellow-500 disabled:opacity-50" />
          </div>
        </div>
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
          <Link href="/" className="font-bold text-slate-900 flex items-center gap-1.5">
            <svg className="w-5 h-5 text-indigo-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 14h6M9 18h6"/></svg>
            契約書AIレビュー
          </Link>
          <span className={`text-xs px-3 py-1 rounded-full ${isPremium ? "bg-indigo-100 text-indigo-600" : isLimit ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
            {isPremium ? "プレミアム" : isLimit ? "無料枠終了" : `無料あと${FREE_LIMIT - count}回`}
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <ReviewHistoryPanel />
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-gray-900">契約書を貼り付けてください</h1>
              {streak && streak.count > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm" aria-label={`${streak.count}日連続利用中`}>
                  {streak.count >= 7 ? "★" : streak.count >= 3 ? "+" : ""}
                  {streak.count}日連続
                </span>
              )}
            </div>
            {streakMsg && (
              <p className="text-xs font-semibold text-indigo-600 mb-1 animate-pulse">{streakMsg}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">全文またはチェックしたい条項をそのまま貼り付けてください。AIが4つの視点で分析します。</p>
          </div>

          {/* チェックモード選択 */}
          <div className="backdrop-blur-sm bg-white/80 border border-white/40 shadow-lg rounded-xl p-4 space-y-3">
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

          {/* 契約書種別クイック選択 */}
          <div className="backdrop-blur-sm bg-orange-50/80 border border-white/40 shadow-lg rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-orange-700">契約書の種類（任意）</p>
            <div className="flex flex-wrap gap-2">
              {CONTRACT_TYPES.map(ct => (
                <button
                  key={ct.id}
                  type="button"
                  onClick={() => setContractType(contractType === ct.id ? "" : ct.id)}
                  aria-label={`契約書の種類「${ct.label}」を選択`}
                  aria-pressed={contractType === ct.id}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${contractType === ct.id ? "border-orange-500 bg-orange-500 text-white" : "border-orange-300 bg-white text-orange-700 hover:border-orange-400 hover:bg-orange-50"}`}
                >
                  <span>{ct.label}</span>
                </button>
              ))}
            </div>
            {contractType && (
              <p className="text-xs text-orange-600 mt-1">選択した契約書種別に合わせたリスク箇所を重点チェックします</p>
            )}
          </div>

          <FileUploadSection onTextExtracted={(text) => setContractText(text)} />

          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500">契約書テキストを貼り付けてください</span>
            <SampleFillButton contractType={contractType} onFill={(text) => setContractText(text)} />
          </div>
          <textarea
            value={contractText}
            onChange={e => setContractText(e.target.value)}
            rows={14}
            required
            aria-label="契約書テキスト入力欄"
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

          <div className="backdrop-blur-sm bg-indigo-50/80 border border-white/40 shadow-lg rounded-lg p-3 text-xs text-indigo-800">
            <strong>免責事項</strong>：このレビューはAIによる参考情報です。法的効力はありません。重要な契約は必ず弁護士にご相談ください。
          </div>

          <button type="submit" disabled={loading || !contractText.trim()}
            aria-label={loading ? "AI分析実行中" : "入力した契約書をAIでレビューする"}
            className={`w-full font-bold py-3 rounded-lg text-white transition-colors ${isLimit ? "bg-orange-500 hover:bg-orange-600" : "bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300"}`}>
            {loading ? "分析中..." : isLimit ? "プレミアムで無制限にチェック" : "契約書をAIレビュー（無料）"}
          </button>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </form>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2">レビュー結果</label>
          <HistoryPanel onSelect={(result) => setParsed(parseResult(result))} />
          {loading && !parsed ? (
            <div className="flex-1 backdrop-blur-sm bg-white/80 border border-white/40 shadow-lg rounded-xl flex items-center justify-center min-h-[420px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 font-medium">契約書を分析しています...</p>
                <p className="text-xs text-gray-400 mt-2">
                  {checkMode === "toitekihou"
                    ? "総合評価 → 問題条項 → 取適法チェック → 修正提案"
                    : "総合評価 → 問題条項 → 修正提案"}
                </p>
              </div>
            </div>
          ) : loading && parsed ? (
            <div className="flex-1 backdrop-blur-sm bg-white/80 border border-white/40 shadow-lg rounded-xl p-4 min-h-[420px]">
              <div className="flex items-center gap-2 mb-3">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600" />
                <span className="text-xs text-gray-500">AIがレビューを生成中...</span>
              </div>
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                <StreamingWordReveal text={parsed.raw} />
              </div>
            </div>
          ) : parsed ? (
            <>
              <ResultTabs parsed={parsed} isPremium={isPremium} onUpgrade={() => setShowPaywall(true)} />
              {/* 次のアクション3選 */}
              <div className="backdrop-blur-sm bg-indigo-50/80 border border-white/40 shadow-lg rounded-xl p-4 mt-4">
                <p className="text-sm font-bold text-indigo-800 mb-3">次にやるべきこと3選</p>
                <ol className="space-y-2">
                  {[
                    "「修正提案」タブの内容をコピーして先方に修正依頼を出す",
                    "リスクが高い条項は弁護士ドットコムで専門家に相談する",
                    "契約書と今回の分析結果を同じフォルダに保存して記録を残す",
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="font-bold text-indigo-600 leading-none min-w-[1.25rem]">{i + 1}.</span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ol>
              </div>
              {/* 契約後の会計・経費管理アフィリエイト */}
              <div className="backdrop-blur-sm bg-green-50/80 border border-white/40 shadow-lg rounded-xl p-4 mt-4">
                <p className="text-sm font-bold text-green-800 mb-1">契約後の会計・経費管理に</p>
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
            <div className="flex-1 backdrop-blur-sm bg-white/80 border border-white/40 shadow-lg rounded-xl flex flex-col items-center justify-center min-h-[420px] gap-3">
              <svg className="w-12 h-12 text-indigo-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 14h6M9 18h6"/></svg>
              <p className="text-sm text-center font-medium text-gray-500">契約書を貼り付けて<br />「AIレビュー」を押してください</p>
              <div className="bg-gray-50 rounded-lg p-4 text-xs space-y-2 w-full max-w-[260px]">
                <p className="font-semibold text-gray-600">4つの視点で分析：</p>
                <p className="text-gray-500">
                  <svg className="inline w-3.5 h-3.5 mr-1 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
                  総合評価（リスクレベルA〜E）
                </p>
                <p className="text-gray-500">
                  <svg className="inline w-3.5 h-3.5 mr-1 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
                  問題条項（場所と理由を明示）
                </p>
                <p className="text-gray-500">
                  <svg className="inline w-3.5 h-3.5 mr-1 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v18M3 7l4.5-3h9L21 7M6 7c-1.5 2-1.5 4 0 5M18 7c1.5 2 1.5 4 0 5"/></svg>
                  有利不利（交渉ポイント整理）
                </p>
                <p className="text-gray-500">
                  <svg className="inline w-3.5 h-3.5 mr-1 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  修正提案（コピーしてすぐ使える）
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 弁護士相談アフィリエイト（A8.net申請後URLを差し替え） */}
      <div className="max-w-2xl mx-auto px-4 pb-6">
        <div className="backdrop-blur-sm bg-indigo-50/80 border border-white/40 shadow-lg rounded-xl p-5">
          <p className="text-sm font-black text-indigo-900 mb-1 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-amber-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3v18M3 7l4.5-3h9L21 7M6 7c-1.5 2-1.5 4 0 5M18 7c1.5 2 1.5 4 0 5"/></svg>
            弁護士に契約書を確認してもらう
          </p>
          <p className="text-xs text-indigo-700 mb-4">AIレビューで問題点を把握したら、重要な契約は弁護士の最終確認で安心。初回相談無料の事務所多数。</p>
          <div className="space-y-2">
            <a href="https://www.bengo4.com/c_1009/" target="_blank" rel="noopener noreferrer sponsored"
              className="flex items-center justify-between bg-white border border-indigo-300 rounded-xl px-4 py-3 hover:bg-indigo-50 transition-colors">
              <div>
                <div className="text-sm font-bold text-slate-800">弁護士ドットコム — 契約書・法務</div>
                <div className="text-xs text-slate-500 mt-0.5">初回相談無料 • フリーランス・中小企業向け</div>
              </div>
              <span className="text-indigo-600 font-bold text-xs bg-indigo-100 px-2 py-1 rounded-full">無料相談 →</span>
            </a>
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
