import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "フリーランス契約書チェックリスト：絶対確認すべき10項目【2026年版】",
  description:
    "フリーランスが業務委託契約書を締結する前に必ず確認すべき10項目を解説。著作権・支払いサイト・競業禁止・損害賠償など、弁護士いらずでリスク回避できるチェックリスト。",
  openGraph: {
    title: "フリーランス契約書チェックリスト：絶対確認すべき10項目【2026年版】",
    description:
      "業務委託契約書の署名前に必ず確認すべき10項目。著作権・競業禁止・損害賠償上限など、フリーランスがよく見落とすリスク条項を徹底解説。",
    url: "https://keiyakusho-ai.vercel.app/blog/freelance-contract-checklist",
    type: "article",
  },
};

const CHECKLIST_ITEMS = [
  {
    no: 1,
    icon: "📝",
    title: "業務内容の明確化",
    risk: "曖昧表現による追加作業の強要リスク",
    detail:
      "「その他必要な業務」「関連業務全般」など曖昧な表現が入っていると、契約範囲外の作業を無償で要求される可能性があります。",
    checkPoint: "納品物・作業範囲・除外事項を具体的に列挙しているか確認しましょう。「Webサイト制作のうちデザイン・コーディングのみを対象とし、運用保守は含まない」のように明記するのが理想です。",
    danger: "高",
    dangerColor: "text-red-600 bg-red-50 border-red-200",
  },
  {
    no: 2,
    icon: "💴",
    title: "報酬・支払いサイト（遅延損害金の有無）",
    risk: "支払い遅延・踏み倒しリスク",
    detail:
      "「納品後60日以内に支払う」という条項は取引適正化法（2026年1月施行）に抵触する可能性があります。また遅延損害金の定めがない場合、遅延しても実質ペナルティがありません。",
    checkPoint: "支払い期日は「納品確認後30日以内」が望ましい。「支払いを怠った場合、年14.6%の遅延損害金を請求できる」旨も明記してもらいましょう。",
    danger: "高",
    dangerColor: "text-red-600 bg-red-50 border-red-200",
  },
  {
    no: 3,
    icon: "©️",
    title: "知的財産権の帰属（著作権・商標）",
    risk: "制作物の著作権を丸ごと失うリスク",
    detail:
      "「成果物の著作権は完成と同時に委託者に帰属する」という条項は、ポートフォリオへの掲載すら禁じられる場合があります。著作者人格権の不行使も注意が必要です。",
    checkPoint: "「著作財産権は受託者に帰属し、委託者は成果物の使用を許諾される」という形が受託者に有利。少なくとも「ポートフォリオへの掲載権は受託者が保持する」旨を入れましょう。",
    danger: "高",
    dangerColor: "text-red-600 bg-red-50 border-red-200",
  },
  {
    no: 4,
    icon: "🔐",
    title: "秘密保持義務（期間・範囲）",
    risk: "「永続」秘密保持により実績を公開できないリスク",
    detail:
      "「本条の効力は契約終了後も永続して存続する」という条項が入っていると、過去の業務実績を一切公開できなくなります。また範囲が「業務上知り得た一切の情報」と広すぎる場合も問題です。",
    checkPoint: "秘密保持の有効期間は「契約終了後2〜3年間」が一般的。「公知情報・独自開発情報は除外する」旨も確認しましょう。",
    danger: "中",
    dangerColor: "text-orange-600 bg-orange-50 border-orange-200",
  },
  {
    no: 5,
    icon: "⚡",
    title: "契約解除条件（一方的解除への対応）",
    risk: "突然の契約打ち切りによる収入喪失リスク",
    detail:
      "「委託者はいつでも本契約を解除できる」という条項は、突然の打ち切りでも損害賠償を請求しにくくします。通知期間も「30日前」では短すぎる場合があります。",
    checkPoint: "「解約通知は60〜90日前に行う」「途中解約の場合は完成割合に応じた報酬を支払う」という条項を交渉で追加しましょう。",
    danger: "高",
    dangerColor: "text-red-600 bg-red-50 border-red-200",
  },
  {
    no: 6,
    icon: "⚖️",
    title: "損害賠償の上限（リスクヘッジ）",
    risk: "全額賠償で事業が吹き飛ぶリスク",
    detail:
      "「受託者は損害の全額を賠償する（上限なし）」という条項は、フリーランスにとって致命的なリスクです。システムの不具合で数千万円の損害賠償を請求されたケースもあります。",
    checkPoint: "「損害賠償額は当該業務の委託料を上限とする」が標準的な条項です。賠償上限は必ず設定してもらいましょう。",
    danger: "高",
    dangerColor: "text-red-600 bg-red-50 border-red-200",
  },
  {
    no: 7,
    icon: "🔄",
    title: "再委託の可否",
    risk: "外注・協力者を使えなくなるリスク",
    detail:
      "「再委託を禁止する」という条項が入っていると、外注パートナーへの一部業務の委託ができなくなります。特にチームで動いているフリーランスには致命的です。",
    checkPoint: "「事前書面による承諾を得た場合は再委託できる」という条項であれば許容範囲。禁止条項がある場合は「承諾制」への変更を交渉しましょう。",
    danger: "中",
    dangerColor: "text-orange-600 bg-orange-50 border-orange-200",
  },
  {
    no: 8,
    icon: "🏛️",
    title: "準拠法・管轄裁判所",
    risk: "遠方での裁判対応コスト増大リスク",
    detail:
      "「管轄裁判所は委託者の本社所在地を管轄する裁判所とする」という条項は、遠方の企業とトラブルになった場合に訴訟コストが大きくなります。",
    checkPoint: "「管轄裁判所は受託者の住所地を管轄する裁判所とする」または「東京地方裁判所を第一審の専属的合意管轄とする」等、双方に公平な条項を求めましょう。",
    danger: "低",
    dangerColor: "text-blue-600 bg-blue-50 border-blue-200",
  },
  {
    no: 9,
    icon: "✅",
    title: "納期・検収条件（瑕疵担保）",
    risk: "永遠に「検収が完了しない」にされるリスク",
    detail:
      "「委託者が検収を完了した日をもって納品とする」のみでは、いつまでも検収を引き延ばされる可能性があります。瑕疵担保期間も確認が必要です。",
    checkPoint: "「納品後10〜14日以内に検収完了の通知がない場合は自動的に検収完了とみなす」という条項を入れてもらいましょう。瑕疵担保期間は「納品から6ヶ月以内」が一般的です。",
    danger: "中",
    dangerColor: "text-orange-600 bg-orange-50 border-orange-200",
  },
  {
    no: 10,
    icon: "🚫",
    title: "反社条項の有無",
    risk: "反社会的勢力との契約による社会的信用喪失リスク",
    detail:
      "反社条項（暴力団等の排除条項）のない契約書は、取引先の企業コンプライアンス規程に違反する可能性があります。また将来的に金融機関との取引に影響する場合もあります。",
    checkPoint: "「甲および乙は、暴力団等の反社会的勢力に属しないことを表明し、将来にわたっても関係を持たないことを確約する」旨の条項が入っているか確認しましょう。",
    danger: "低",
    dangerColor: "text-blue-600 bg-blue-50 border-blue-200",
  },
];

const DANGER_SUMMARY = [
  { label: "高リスク（必ず確認）", items: [1, 2, 3, 5, 6], color: "bg-red-100 text-red-700 border-red-300" },
  { label: "中リスク（交渉推奨）", items: [4, 7, 9], color: "bg-orange-100 text-orange-700 border-orange-300" },
  { label: "低リスク（確認程度）", items: [8, 10], color: "bg-blue-100 text-blue-700 border-blue-300" },
];

export default function FreelanceContractChecklist() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* パンくずナビ */}
      <nav className="bg-gray-50 border-b px-4 py-3 text-xs text-gray-500">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <Link href="/" className="hover:text-indigo-600 transition-colors">契約書AIレビュー</Link>
          <span>›</span>
          <span className="text-gray-700">フリーランス契約書チェックリスト</span>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 py-10">
        {/* ヘッダー */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">フリーランス向け</span>
            <span className="inline-block bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">2026年版</span>
            <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">取適法対応</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black leading-tight text-gray-900 mb-4">
            フリーランス契約書チェックリスト：<br />絶対確認すべき10項目【2026年版】
          </h1>
          <p className="text-gray-600 leading-relaxed">
            業務委託契約書に署名する前に確認すべき10項目をまとめました。
            著作権の丸ごと譲渡・競業禁止・損害賠償上限なし——知らずに署名すると取り返しのつかないリスクが潜んでいます。
            本記事を読んで、契約書の"罠"を見抜いてください。
          </p>
          <p className="text-xs text-gray-400 mt-3">最終更新: 2026年3月 / 取引適正化法（2026年1月施行）対応</p>
        </header>

        {/* リスクサマリー */}
        <section className="mb-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">リスク別チェック項目サマリー</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {DANGER_SUMMARY.map((d) => (
              <div key={d.label} className={`border rounded-xl p-4 ${d.color}`}>
                <p className="text-xs font-bold mb-2">{d.label}</p>
                <p className="text-sm font-medium">項目 {d.items.join("・")}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center">
            <p className="text-sm font-bold text-indigo-800 mb-2">
              読むのが面倒な方へ：契約書を貼り付けるだけで全10項目を自動チェック
            </p>
            <Link
              href="/tool"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
              AIで今すぐチェックする（無料3回）→
            </Link>
          </div>
        </section>

        {/* チェックリスト本文 */}
        <section className="space-y-8 mb-12">
          <h2 className="text-xl font-black text-gray-900">10項目の詳細解説</h2>
          {CHECKLIST_ITEMS.map((item) => (
            <div key={item.no} className="border border-gray-200 rounded-2xl overflow-hidden">
              {/* ヘッダー */}
              <div className="bg-gray-50 px-5 py-4 flex items-start gap-3 border-b border-gray-200">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-gray-400">チェック項目 {item.no}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${item.dangerColor}`}>
                      危険度: {item.danger}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mt-1">{item.title}</h3>
                  <p className="text-xs text-red-600 font-medium mt-0.5">⚠️ {item.risk}</p>
                </div>
              </div>
              {/* 本文 */}
              <div className="px-5 py-4 space-y-3">
                <p className="text-sm text-gray-700 leading-relaxed">{item.detail}</p>
                <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-green-700 mb-1">✓ チェックポイント</p>
                  <p className="text-sm text-green-800 leading-relaxed">{item.checkPoint}</p>
                </div>
                <div className="text-right">
                  <Link
                    href="/tool"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    AIでこの項目をチェックする →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* まとめ */}
        <section className="mb-12 bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">まとめ：署名前に必ず確認する5つの最重要条項</h2>
          <ol className="space-y-2 mb-6">
            {[
              "業務範囲を具体的に定義しているか",
              "著作権の帰属が受託者不利になっていないか",
              "損害賠償に上限が設けられているか",
              "一方的な契約解除に適切な通知期間があるか",
              "報酬支払いサイトが取適法に違反していないか",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            10項目すべてを手動で確認するのは大変です。契約書テキストをコピーして貼り付けるだけで、
            AIが問題条項を自動検出し、具体的な修正提案まで出力します。
            弁護士費用ゼロで署名前のリスク確認ができます。
          </p>
        </section>

        {/* 最終CTA */}
        <section className="bg-indigo-600 rounded-2xl p-8 text-center text-white">
          <div className="text-4xl mb-3">📋</div>
          <h2 className="text-xl font-black mb-2">この契約書、今すぐAIでレビュー</h2>
          <p className="text-indigo-200 text-sm mb-6 leading-relaxed">
            契約書テキストを貼り付けるだけで、10項目のリスクチェック＋修正提案を数秒で出力。
            登録不要・無料3回から試せます。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tool"
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black px-8 py-3.5 rounded-xl text-sm transition-colors"
            >
              無料でAIチェックを始める →
            </Link>
            <Link
              href="/"
              className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-colors"
            >
              サービス詳細を見る
            </Link>
          </div>
          <p className="text-indigo-300 text-xs mt-4">クレジットカード不要 • 3回無料 • 取適法（2026年1月施行）対応済み</p>
        </section>

        {/* 関連リンク */}
        <section className="mt-10 pt-8 border-t border-gray-100">
          <p className="text-sm font-bold text-gray-500 mb-4">関連ページ</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/tool" className="text-sm text-indigo-600 hover:text-indigo-800 underline underline-offset-2">
              契約書AIレビューツール
            </Link>
            <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-800 underline underline-offset-2">
              サービストップページ
            </Link>
          </div>
        </section>
      </article>

      <footer className="text-center py-6 text-xs text-gray-400 border-t">
        <Link href="/legal" className="hover:text-gray-600 mr-4">特定商取引法に基づく表記</Link>
        <Link href="/privacy" className="hover:text-gray-600">プライバシーポリシー</Link>
      </footer>
    </main>
  );
}
