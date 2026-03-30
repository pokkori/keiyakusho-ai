import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CrossSell } from "@/components/CrossSell";

/* ------------------------------------------------------------------ */
/*  キーワード定義                                                      */
/* ------------------------------------------------------------------ */

interface KeywordData {
  slug: string;
  keyword: string;
  heroTitle: string;
  heroSub: string;
  features: { title: string; desc: string }[];
  faq: { q: string; a: string }[];
  lastUpdated: string;
}

const KEYWORDS: KeywordData[] = [
  {
    slug: "keiyakusho-check-ai",
    keyword: "契約書チェック AI",
    heroTitle: "契約書を貼り付けるだけ",
    heroSub: "AIが13項目のリスクを30秒でチェック",
    features: [
      { title: "13項目の自動チェック", desc: "損害賠償・競業禁止・著作権など13項目をAIが網羅的にスキャン。見落としゼロへ。" },
      { title: "30秒でレビュー完了", desc: "契約書を貼り付けてボタンを押すだけ。弁護士に依頼する数日の待ち時間が不要に。" },
      { title: "修正案をコピペで使える", desc: "リスク箇所の指摘だけでなく、修正提案文をコピペ可能な形式で自動生成します。" },
    ],
    faq: [
      { q: "AIの契約書チェックはどの程度正確ですか？", a: "最新の大規模言語モデルを使用し、一般的な契約書のリスク箇所検出率は80〜90%水準です。ただしAIの結果は参考情報であり、重要案件は弁護士にご確認ください。" },
      { q: "どんな種類の契約書に対応していますか？", a: "業務委託・NDA・雇用契約・売買契約・SaaS利用規約など、ほぼすべての日本語契約書に対応しています。" },
      { q: "チェック結果はどのような形式で表示されますか？", a: "リスクレベル（高・中・低）の色分け表示、該当条項の引用、修正提案文、交渉ポイントをセットで表示します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  {
    slug: "keiyakusho-review-muryou",
    keyword: "契約書レビュー 無料",
    heroTitle: "契約書のリスクチェックを無料3回お試し",
    heroSub: "フリーランス必見。登録不要で今すぐ使える",
    features: [
      { title: "登録不要・無料3回", desc: "メールアドレスの登録も不要。今すぐ契約書を貼り付けるだけで無料レビューを開始できます。" },
      { title: "弁護士費用の90%削減", desc: "弁護士に依頼すると1件5万円。AIで1次スクリーニングすれば、問題箇所だけ弁護士に相談でコスト激減。" },
      { title: "取引適正化法にも対応", desc: "2026年施行の取引適正化法（旧下請法改正）のチェックモードも搭載。フリーランスの権利を守ります。" },
    ],
    faq: [
      { q: "本当に無料で使えますか？", a: "はい。登録不要で3回まで無料でご利用いただけます。追加利用は1回980円、プレミアムプラン2,980円/月で無制限です。" },
      { q: "無料版と有料版の違いは？", a: "無料版は8,000文字まで、有料版は20,000文字まで対応。さらにプレミアムでは回数無制限・優先処理が可能です。" },
      { q: "クレジットカード情報は必要ですか？", a: "無料利用にクレジットカードは不要です。有料プランへのアップグレード時のみ決済情報をご入力いただきます。" },
    ],
    lastUpdated: "2026-03-31",
  },
  {
    slug: "gyoumu-itaku-keiyaku-check",
    keyword: "業務委託契約 チェック",
    heroTitle: "業務委託契約書のリスク条項をAIが自動検出",
    heroSub: "修正案も提示。フリーランス・中小企業の味方",
    features: [
      { title: "著作権条項の自動チェック", desc: "「著作権の全部譲渡」など不利な条項を検出し、「利用許諾方式」への修正案を自動生成。" },
      { title: "報酬・支払条件の確認", desc: "支払サイト60日超や成果物納品後の追加修正義務など、不当な条件をAIが指摘します。" },
      { title: "取引適正化法の違反リスク判定", desc: "受領拒否・報酬減額・買いたたきなど6つの禁止行為に該当するかAIが自動判定します。" },
    ],
    faq: [
      { q: "業務委託契約で特に注意すべき条項は？", a: "著作権の帰属、損害賠償の上限、競業避止義務、再委託の可否、中途解約条件の5つが特に重要です。本AIはこれらを重点的にチェックします。" },
      { q: "業務委託と雇用契約の違いもチェックできますか？", a: "はい。偽装請負（実質的に雇用関係にある業務委託）のリスク要素も検出し、指摘します。" },
      { q: "修正案はそのまま使えますか？", a: "一般的な修正案として使用できますが、個別の取引条件に応じた調整が必要な場合があります。重要案件は弁護士にご確認ください。" },
    ],
    lastUpdated: "2026-03-31",
  },
  {
    slug: "himitsu-hoji-keiyaku",
    keyword: "秘密保持契約 NDA",
    heroTitle: "NDAのチェックポイントをAIが解説",
    heroSub: "片務・双務の違いも判定。秘密情報の定義漏れを検出",
    features: [
      { title: "片務・双務NDAの自動判定", desc: "一方的に不利な片務NDAを検出。双務NDAへの修正提案文も自動生成します。" },
      { title: "秘密情報の定義チェック", desc: "口頭情報の取り扱い、秘密指定の範囲など、曖昧な定義によるリスクをAIが指摘。" },
      { title: "有効期間・損害賠償の妥当性判定", desc: "業界標準（2〜3年）と比較し、過度に長い期間や上限なしの賠償条項を警告します。" },
    ],
    faq: [
      { q: "NDAで最も見落としやすいリスクは？", a: "秘密情報の定義が曖昧なケースです。「口頭で開示した情報も含む」と書かれていると、立証が困難になります。本AIは定義の明確性を自動チェックします。" },
      { q: "片務NDAと双務NDAの違いは？", a: "片務NDAは一方のみが秘密保持義務を負います。双務NDAは双方が義務を負います。対等な取引では双務NDAが推奨されます。" },
      { q: "NDAの有効期間はどのくらいが適切ですか？", a: "一般的には2〜3年が業界標準です。5年以上の期間設定は過度な制約となる可能性があり、本AIでは警告を表示します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  {
    slug: "keiyakusho-bengoshi-hiyou",
    keyword: "契約書 弁護士 費用",
    heroTitle: "弁護士費用5万円が980円/月に",
    heroSub: "AIで契約書レビューを90%コスト削減",
    features: [
      { title: "1件5万円→980円", desc: "弁護士に契約書レビューを依頼すると1件3〜10万円。AIなら1回980円、月額2,980円で無制限。" },
      { title: "即日レビュー", desc: "弁護士への依頼は数日〜1週間。AIなら貼り付けて30秒で結果表示。急ぎの契約にも対応。" },
      { title: "弁護士相談の前の1次スクリーニング", desc: "AIで問題箇所を事前に特定。弁護士には重要ポイントだけ相談して費用を最小化。" },
    ],
    faq: [
      { q: "弁護士に依頼する代わりになりますか？", a: "本サービスはAIによる参考情報提供であり、法的アドバイスではありません。AIで1次スクリーニングし、問題箇所だけ弁護士に相談することでコスト削減が可能です。" },
      { q: "料金プランを教えてください", a: "無料3回お試し、1回払い980円、プレミアム2,980円/月（無制限・20,000文字対応）の3プランです。" },
      { q: "GVA assistとの料金比較は？", a: "GVA assistは月75,000円〜で企業法務部向けです。本サービスは月2,980円と個人・中小企業でも使いやすい価格帯です。" },
    ],
    lastUpdated: "2026-03-31",
  },
  {
    slug: "freelance-keiyaku-chuuiten",
    keyword: "フリーランス 契約 注意点",
    heroTitle: "フリーランスの契約で注意すべき7つのポイント",
    heroSub: "AIがチェック。不利な条項を見逃さない",
    features: [
      { title: "7大リスクの自動検出", desc: "著作権譲渡・損害賠償上限なし・競業禁止・中途解約・支払遅延・再委託制限・偽装請負の7項目を重点チェック。" },
      { title: "取引適正化法の保護を活用", desc: "2026年施行の取引適正化法でフリーランスの権利が強化。AIが違反リスクを判定し、交渉材料を提供。" },
      { title: "交渉テンプレート付き", desc: "「この条項を修正してほしい」と伝えるための交渉文面もセットで生成。コピペで使えます。" },
    ],
    faq: [
      { q: "フリーランスが最も注意すべき契約条項は？", a: "損害賠償の上限なし条項と著作権の全部譲渡条項です。前者は予期せぬ高額請求のリスク、後者はポートフォリオ使用制限のリスクがあります。" },
      { q: "取引適正化法でフリーランスはどう守られますか？", a: "報酬の減額・買いたたき・受領拒否などの6行為が禁止されます。本AIの取適法チェックモードで、契約書が法令に適合しているか判定できます。" },
      { q: "契約書を持っていない場合は？", a: "口約束で仕事を受けているフリーランスの方も多いですが、必ず書面化することを推奨します。本AIのテンプレート生成機能で契約書の雛形を作成できます。" },
    ],
    lastUpdated: "2026-03-31",
  },
  {
    slug: "chinshaku-keiyaku-check",
    keyword: "賃貸借契約 チェック",
    heroTitle: "賃貸借契約書の不利な条項をAIが自動検出",
    heroSub: "敷金・原状回復・更新料のトラブルを未然に防ぐ",
    features: [
      { title: "原状回復義務の範囲チェック", desc: "通常損耗まで借主負担とする不当条項を検出。国交省ガイドラインとの整合性をAIが判定。" },
      { title: "更新料・違約金の妥当性判定", desc: "更新料や中途解約違約金が相場と比較して過大でないかAIがチェックします。" },
      { title: "特約条項のリスク分析", desc: "ペット不可・楽器不可などの特約だけでなく、借主に過度な義務を課す特約を検出します。" },
    ],
    faq: [
      { q: "賃貸借契約で最も注意すべき条項は？", a: "原状回復義務の範囲です。通常の使用による劣化（通常損耗）は貸主負担が原則ですが、契約書で借主負担とされているケースが多くあります。" },
      { q: "すでに契約済みの契約書もチェックできますか？", a: "はい。契約済みの契約書でも、不当条項の有無を確認し、更新時の交渉材料としてお使いいただけます。" },
      { q: "法人の賃貸借契約にも対応していますか？", a: "はい。居住用だけでなく、事業用の賃貸借契約書にも対応しています。定期借家契約のチェックも可能です。" },
    ],
    lastUpdated: "2026-03-31",
  },
  {
    slug: "roudou-keiyaku-check",
    keyword: "労働契約 チェック",
    heroTitle: "労働契約書・雇用契約書の問題点をAIが指摘",
    heroSub: "残業・退職・競業禁止の不利な条項を見逃さない",
    features: [
      { title: "残業・固定残業代のチェック", desc: "固定残業代の時間数と金額の妥当性、超過分の支払い義務の記載有無をAIが確認。" },
      { title: "退職・解雇条件の確認", desc: "不当な退職制限（退職金返還条項など）や解雇要件の曖昧さをAIが指摘します。" },
      { title: "競業避止義務の妥当性判定", desc: "退職後の競業禁止期間・地域・範囲が判例基準と比較して過度でないかチェック。" },
    ],
    faq: [
      { q: "労働契約書で最も見落としやすいリスクは？", a: "固定残業代の計算根拠が不明確なケースです。「月40時間分の固定残業代を含む」とだけ書かれ、金額が明示されていない場合はリスクがあります。" },
      { q: "試用期間に関する条項もチェックできますか？", a: "はい。試用期間の長さ（3ヶ月超は注意）、本採用拒否の要件、試用期間中の待遇差などを確認します。" },
      { q: "派遣契約・業務委託との違いも判定できますか？", a: "はい。雇用契約と称しながら実質的に業務委託扱いとなっている偽装雇用のリスク要素も検出します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  {
    slug: "keiyakusho-template-ai",
    keyword: "契約書 テンプレート AI",
    heroTitle: "AIが契約書テンプレートを生成",
    heroSub: "業種・取引内容に合わせてカスタマイズ",
    features: [
      { title: "業種別テンプレート", desc: "IT・デザイン・コンサル・建設など業種に最適化されたテンプレートをAIが生成。" },
      { title: "取引内容に合わせてカスタマイズ", desc: "金額・期間・成果物などを入力するだけで、取引に合わせた契約書を自動作成。" },
      { title: "リスクチェック済みテンプレート", desc: "生成された契約書は自動的にリスクチェック済み。不利な条項のない安全な雛形です。" },
    ],
    faq: [
      { q: "テンプレートはそのまま使えますか？", a: "一般的な取引にはそのまま使用可能です。ただし高額案件や特殊な条件がある場合は、弁護士への最終確認を推奨します。" },
      { q: "どのような種類のテンプレートがありますか？", a: "業務委託契約・NDA・売買契約・SaaS利用規約・ライセンス契約など主要な契約書のテンプレートを生成できます。" },
      { q: "生成したテンプレートの編集はできますか？", a: "はい。生成されたテンプレートはテキスト形式で出力されるため、自由に編集・加工いただけます。" },
    ],
    lastUpdated: "2026-03-31",
  },
  {
    slug: "risk-jyoukou-kaisetsu",
    keyword: "リスク条項 解説",
    heroTitle: "契約書のリスク条項をAIが平易に解説",
    heroSub: "損害賠償・解除・競業避止を分かりやすく",
    features: [
      { title: "専門用語を平易に翻訳", desc: "法律用語が難しい契約書の条項を、誰でも分かる日本語に自動翻訳。理解度が格段に向上。" },
      { title: "リスクレベルの可視化", desc: "各条項のリスクを「高・中・低」の3段階で色分け表示。一目で危険な箇所が分かります。" },
      { title: "判例・法令の根拠付き", desc: "なぜその条項がリスクなのか、関連する判例や法令条文を引用して解説します。" },
    ],
    faq: [
      { q: "法律知識がなくても理解できますか？", a: "はい。AIが専門用語を平易な日本語に翻訳し、具体的な事例を交えて解説するため、法律の知識がなくても理解できます。" },
      { q: "損害賠償条項の相場はどのくらいですか？", a: "業務委託契約では委託料の範囲内（上限あり）が一般的です。上限なし条項は予期せぬ高額請求のリスクがあり、本AIでは必ず警告を表示します。" },
      { q: "競業避止義務は拒否できますか？", a: "期間が6ヶ���〜1年を超える場合や、地域・範囲が過度に広い場合は、公序良俗違反として無効になる可能性があります。交渉の余地は十分にあります。" },
    ],
    lastUpdated: "2026-03-31",
  },
];

const KEYWORD_MAP = new Map(KEYWORDS.map((k) => [k.slug, k]));

/* ------------------------------------------------------------------ */
/*  generateStaticParams                                                */
/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  return KEYWORDS.map((k) => ({ slug: k.slug }));
}

/* ------------------------------------------------------------------ */
/*  generateMetadata                                                    */
/* ------------------------------------------------------------------ */

const SITE_URL = "https://keiyaku-review.vercel.app";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const kw = KEYWORD_MAP.get(params.slug);
  if (!kw) return {};
  const title = `${kw.keyword}｜契約書AIレビュー`;
  const description = `${kw.heroTitle}。${kw.heroSub}。登録不要・無料3回から。`;
  return {
    title,
    description,
    other: {
      "article:modified_time": kw.lastUpdated,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/keywords/${kw.slug}`,
      siteName: "契約書AIレビュー",
      locale: "ja_JP",
      type: "website",
      images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og.png`],
    },
    alternates: { canonical: `${SITE_URL}/keywords/${kw.slug}` },
  };
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                      */
/* ------------------------------------------------------------------ */

export default function KeywordPage({ params }: { params: { slug: string } }) {
  const kw = KEYWORD_MAP.get(params.slug);
  if (!kw) notFound();

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "dateModified": kw.lastUpdated,
    mainEntity: kw.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <main
        className="min-h-screen text-white"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(37,99,235,0.08) 0%, transparent 50%), #0B0F1E",
        }}
      >
        {/* ---- Hero ---- */}
        <section className="relative overflow-hidden px-4 pt-16 pb-12 text-center">
          {/* Glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[420px] w-[640px] rounded-full opacity-30 blur-[120px]"
            style={{ background: "linear-gradient(135deg, #3B82F6, #818CF8)" }}
          />

          <p className="relative mb-3 inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-sm font-medium text-blue-300">
            {kw.keyword}
          </p>

          <h1
            className="relative mx-auto max-w-2xl text-3xl font-bold leading-tight sm:text-4xl"
            style={{
              background: "linear-gradient(135deg, #BFDBFE, #FFFFFF, #C7D2FE)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {kw.heroTitle}
          </h1>

          <p className="relative mt-4 text-lg" style={{ color: "rgba(147,197,253,0.8)" }}>
            {kw.heroSub}
          </p>

          <div className="relative mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/tool"
              className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-bold text-white shadow-lg transition-transform hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #3B82F6, #818CF8)",
                boxShadow: "0 0 30px rgba(59,130,246,0.4), 0 0 60px rgba(129,140,248,0.15)",
              }}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </svg>
              無料で契約書をチェック
            </Link>
            <span className="text-sm" style={{ color: "rgba(147,197,253,0.5)" }}>
              登録不要・無料3回
            </span>
          </div>
        </section>

        {/* ---- Features ---- */}
        <section className="mx-auto max-w-4xl px-4 py-12">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">特長</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {kw.features.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-transform hover:scale-[1.02]"
              >
                <div
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #3B82F6, #818CF8)" }}
                >
                  {i + 1}
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(147,197,253,0.8)" }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ---- FAQ ---- */}
        <section className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">よくある質問</h2>
          <div className="space-y-4">
            {kw.faq.map((f, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-base font-medium text-white">
                  {f.q}
                  <svg
                    className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180"
                    style={{ color: "rgba(147,197,253,0.5)" }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </summary>
                <div
                  className="px-6 pb-4 text-sm leading-relaxed"
                  style={{ color: "rgba(147,197,253,0.8)" }}
                >
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ---- CTA ---- */}
        <section className="mx-auto max-w-2xl px-4 py-12 text-center">
          <h2 className="mb-4 text-2xl font-bold text-white">今すぐ無料でチェック</h2>
          <p className="mb-6 text-sm" style={{ color: "rgba(147,197,253,0.8)" }}>
            契約書を貼り付けるだけ。30秒でリスクチェック完了。
          </p>
          <Link
            href="/tool"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-bold text-white shadow-lg transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #3B82F6, #818CF8)",
              boxShadow: "0 0 30px rgba(59,130,246,0.4), 0 0 60px rgba(129,140,248,0.15)",
            }}
          >
            無料で契約書をチェック
          </Link>
        </section>

        {/* LastUpdated */}
        <p className="text-center text-xs text-white/40 mt-8">
          最終更新: 2026年3月31日
        </p>

        {/* ---- CrossSell ---- */}
        <section className="mx-auto max-w-5xl px-4 pb-16">
          <CrossSell currentService="契約書AIレビュー" />
        </section>
      </main>
    </>
  );
}
