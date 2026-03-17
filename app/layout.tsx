import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE_URL = "https://keiyakusho-ai.vercel.app";
const TITLE = "契約書AIレビュー｜契約書のリスクをAIが即チェック・修正案を自動生成・無料3回・取適法対応";
const DESC = "契約書をアップロードするだけ。AIが不利な条項・リスク箇所を即時指摘し、修正案・交渉ポイントまで自動生成。弁護士費用ゼロで契約書を守る。業務委託・NDA・取引適正化法（取適法）対応。登録不要で無料3回から。¥980/回〜。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📜</text></svg>" },
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
      ],
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
