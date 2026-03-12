"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

function Confetti() {
  const [particles, setParticles] = useState<{ id: number; left: number; delay: number; color: string; size: number }[]>([]);

  useEffect(() => {
    const colors = ["#22c55e", "#16a34a", "#eab308", "#3b82f6", "#6366f1", "#a855f7"];
    const ps = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 6,
    }));
    setParticles(ps);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={{
            left: `${p.left}%`,
            top: -20,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti 3s ease-in forwards;
        }
      `}</style>
    </div>
  );
}

function SuccessContent() {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showConfetti && <Confetti />}
      <div className="max-w-lg w-full mx-auto px-4">
        <div className="text-center mb-10">
          <div className="text-7xl mb-4">&#x1F4DD;</div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">プレミアム会員へようこそ！</h1>
          <p className="text-gray-500">契約書AIレビューの全機能が使えます</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-green-800 mb-3 text-sm">あなたの特典</h2>
          <ul className="space-y-2 text-sm text-green-900">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">&#10003;</span>
              契約書AIレビューが無制限
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">&#10003;</span>
              リスク条項の自動検出・改善提案
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">&#10003;</span>
              不利な条件の見落とし防止
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">&#10003;</span>
              修正案の自動生成
            </li>
          </ul>
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="font-bold text-gray-800 text-center text-sm">安全な契約への3ステップ</h2>

          <Link href="/tool" className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-green-400 hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0 group-hover:bg-green-500">1</div>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-sm">契約書をレビューする</p>
              <p className="text-xs text-gray-400">契約書テキストを貼り付けてAIが分析</p>
            </div>
            <span className="text-gray-300 group-hover:text-green-600 transition-colors">&rarr;</span>
          </Link>

          <Link href="/tool" className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-green-400 hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0 group-hover:bg-green-500">2</div>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-sm">リスク条項を確認する</p>
              <p className="text-xs text-gray-400">AIが指摘する要注意ポイントをチェック</p>
            </div>
            <span className="text-gray-300 group-hover:text-green-600 transition-colors">&rarr;</span>
          </Link>

          <Link href="/tool" className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-green-400 hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0 group-hover:bg-green-500">3</div>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-sm">修正案を活用する</p>
              <p className="text-xs text-gray-400">AIの修正提案をコピーして交渉に活用</p>
            </div>
            <span className="text-gray-300 group-hover:text-green-600 transition-colors">&rarr;</span>
          </Link>
        </div>


        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400 mb-1">ご感想をお聞かせください（30秒）</p>
          <a href="mailto:support@pokkorilab.com?subject=%E3%81%94%E6%84%9F%E6%83%B3&body=%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E5%90%8D%EF%BC%9A%0A%E6%84%9F%E6%83%B3%EF%BC%9A" className="text-xs text-blue-500 underline hover:text-blue-700">感想を送る →</a>
        </div>
        <div className="text-center bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">契約トラブルを未然に防ぐ</p>
          <p className="text-sm font-bold text-gray-700">このサイトをブックマークしておきましょう</p>
        </div>
      </div>
    </>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-6">
      <Suspense fallback={<div className="text-center text-gray-500">読み込み中...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
