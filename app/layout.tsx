import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import FeedbackButton from "@/components/FeedbackButton";
import { GoogleAdScript } from "@/components/GoogleAdScript";
import "./globals.css";
import { InstallPrompt } from "@/components/InstallPrompt";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});


const SITE_URL = "https://keiyaku-review.vercel.app";
const TITLE = "契約書AIレビュー｜契約書のリスクをAIが即チェック・修正案を自動生成・無料3回・取適法対応";
const DESC = "契約書をアップロードするだけ。AIが不利な条項・リスク箇所を即時指摘し、修正案・交渉ポイントまで自動生成。弁護士費用ゼロで契約書を守る。業務委託・NDA・取引適正化法（取適法）対応。登録不要で無料3回から。¥980/回〜。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='70' fill='%231e293b'>法</text></svg>" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: SITE_URL,
    siteName: "契約書AIレビュー",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "契約書AIレビュー" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/og.png"],
  },
  metadataBase: new URL(SITE_URL),
  other: { "theme-color": "#0B0F1E" },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "ホーム", "item": SITE_URL },
    { "@type": "ListItem", "position": 2, "name": "契約書AIレビューツール", "item": `${SITE_URL}/tool` },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "契約書AIレビュー",
      "url": SITE_URL,
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "keywords": "契約書,AIレビュー,取引適正化法,取適法,業務委託,NDA,リスクチェック,修正案,無料",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY", "description": "無料3回・1回払い ¥980・プレミアム ¥2,980/月" },
      "description": DESC,
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "どんな種類の契約書に対応していますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "業務委託契約・NDA（秘密保持契約）・雇用契約・売買契約・SaaS利用規約など、ほぼすべての日本語契約書に対応しています。リスク箇所の指摘・修正提案文・交渉ポイントをセットで生成します。"
          }
        },
        {
          "@type": "Question",
          "name": "弁護士の代わりになりますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "本サービスはAIによる参考情報の提供であり、法的アドバイスではありません。ただし、AIで1次スクリーニングを行い、問題箇所だけを弁護士に相談することで弁護士費用を大幅に削減できます。重要な案件には必ず弁護士にご相談ください。"
          }
        },
        {
          "@type": "Question",
          "name": "無料で使えますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "登録不要で1件の契約書レビューを無料でお試しいただけます。プレミアムプラン（¥980/月）で20,000文字対応・無制限レビューが可能になります。"
          }
        },
        {
          "@type": "Question",
          "name": "取引適正化法（取適法）とは何ですか？フリーランスへの影響は？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "取引適正化法（旧下請法を改正した法律・2026年1月施行）は、フリーランスや中小企業が大企業・中堅企業との取引で不当な条件を強いられないよう保護します。受領拒否・報酬減額・買いたたき・不当な利益提供要請などの6行為が禁止されています。本AIの「取適法チェックモード」で、契約書の違反リスクを即判定できます。"
          }
        },
        {
          "@type": "Question",
          "name": "業務委託契約書の著作権条項で注意すべき点は？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "最も多いリスクは「著作権の全部譲渡」条項です。制作物の著作権がクライアントに完全移転すると、ポートフォリオへの使用や将来の流用が制限されます。本AIは「著作財産権は受託者に帰属し、クライアントへの利用許諾とする」形への修正提案をコピペ形式で提示します。"
          }
        },
        {
          "@type": "Question",
          "name": "競業禁止（競業避止義務）条項は修正できますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "「契約終了後2年間、同業他社への役務提供を禁止」のような過剰な競業禁止条項は、公序良俗違反（民法90条）として無効となる可能性があります。業界標準は6ヶ月〜1年です。本AIは「6ヶ月以内」への修正提案文と、交渉で使える根拠をセットで提示します。"
          }
        },
        {
          "@type": "Question",
          "name": "NDA（秘密保持契約書）で特に確認すべき条項は？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "NDAで特に注意すべきは①秘密情報の定義の曖昧さ（口頭情報まで含むか）②有効期間の長さ（業界標準は2年・3年超は交渉余地あり）③損害賠償の上限なし（上限条項の追加を交渉）です。本AIはこれらを自動チェックし、修正提案文を即生成します。"
          }
        },
        {
          "@type": "Question",
          "name": "フリーランスが「損害賠償上限なし」条項を受け入れると何が起きますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "損害賠償上限なしの条項は、万が一のミスで全額請求されるリスクがあります。例えば制作物の納品後にシステム障害が起きた場合、莫大な損害を全額負担させられる可能性があります。本AIは「損害賠償額は委託料の範囲内とする」への修正提案文をコピペ可能な形で提示します。"
          }
        },
        {
          "@type": "Question",
          "name": "GVA assistとの違いは何ですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GVA assist（月¥75,000〜）は企業の法務部向けに特化しており、個人・フリーランスには高額です。本サービスは¥980/回〜と個人でも使いやすい価格帯で、取適法対応・修正提案文のコピペ・即日利用開始という点で個人・中小企業に特化しています。GVA assistの1/76の価格で同等の事前確認が可能です。"
          }
        },
        {
          "@type": "Question",
          "name": "AIレビュー結果の精度はどのくらいですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "最新の大規模言語モデル（LLM）を使用しており、一般的な契約書のリスク箇所検出率は80〜90%水準です。ただし、AIの生成結果はあくまで参考情報であり、法的判断の代替にはなりません。重要な契約の最終確認には、必ず弁護士へのご相談をお勧めします。"
          }
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`dark ${notoSansJP.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${notoSansJP.className} antialiased`}>
        {children}
        <InstallPrompt />
        <footer className="flex justify-center py-2">
          <FeedbackButton serviceName="契約書AIレビュー" />
        </footer>
        <Analytics />
        <GoogleAdScript />
        {/* Microsoft Clarity — プロジェクトIDが設定されたら有効化 */}
        {/* <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "YOUR_CLARITY_PROJECT_ID");
          `}
        </Script> */}
      </body>
    </html>
  );
}
