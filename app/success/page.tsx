"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    const sessionId = params.get("session_id");
    if (!sessionId) { setStatus("error"); return; }
    fetch(`/api/stripe/verify?session_id=${sessionId}`)
      .then(r => r.ok ? setStatus("ok") : setStatus("error"))
      .catch(() => setStatus("error"));
  }, [params]);

  if (status === "loading") return (
    <div className="text-center text-gray-500">認証中...</div>
  );
  if (status === "error") return (
    <div className="text-center">
      <p className="text-red-500 mb-4">認証に失敗しました。</p>
      <Link href="/" className="text-blue-600 underline">トップへ戻る</Link>
    </div>
  );
  return (
    <div className="text-center">
      <div className="text-5xl mb-4">🎉</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">ご契約ありがとうございます！</h1>
      <p className="text-gray-500 mb-6">プレミアムプランが有効になりました。</p>
      <Link href="/tool" className="inline-block bg-green-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-green-700">
        ツールを使う →
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <Suspense fallback={<div className="text-center text-gray-500">読み込み中...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
