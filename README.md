# AI補助金診断

> 事業内容を入力するだけで、活用できる補助金・助成金をAIが診断するSaaSサービス

**本番URL**: https://hojyokin-ai.vercel.app

---

## サービス概要

中小企業・個人事業主向けに、事業内容から申請可能な補助金・助成金をClaude Haiku AIが診断。
ものづくり補助金・小規模事業者持続化補助金・IT導入補助金など主要制度に対応。

## 料金プラン

| プラン | 価格 | 制限 |
|--------|------|------|
| お試し | 無料 | 3回まで |
| スタンダード | ¥980/月 | 月30回 |
| ビジネス | ¥2,980/月 | 無制限 |

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイル**: Tailwind CSS
- **AI**: Anthropic Claude Haiku (claude-haiku-4-5-20251001)
- **デプロイ**: Vercel
- **決済**: Stripe（サブスクリプション）
- **アナリティクス**: Vercel Analytics

## ディレクトリ構成

```
hojyokin-ai/
├── app/
│   ├── page.tsx          # LP（ランディングページ）
│   ├── layout.tsx        # レイアウト・メタデータ
│   ├── tool/
│   │   └── page.tsx      # 診断画面（フォーム・結果表示・Paywall）
│   ├── success/
│   │   └── page.tsx      # 決済完了ページ
│   └── api/
│       ├── generate/
│       │   └── route.ts  # Claude API呼び出し・レート制限・Cookie管理
│       └── stripe/
│           ├── checkout/
│           │   └── route.ts  # Stripeセッション作成
│           └── verify/
│               └── route.ts  # 決済完了確認・Cookie付与
├── .env.local            # 環境変数（Vercelに設定済み）
└── package.json
```

## セキュリティ・制限

- **使用制限**: Cookieベースでサーバー側管理（3回まで無料）
- **レート制限**: 1分間10リクエストまで/IP
- **エラーハンドリング**: API障害・タイムアウト対応済み

## 環境変数

| 変数名 | 説明 |
|--------|------|
| `ANTHROPIC_API_KEY` | Anthropic APIキー |
| `STRIPE_SECRET_KEY` | Stripe シークレットキー |
| `STRIPE_PRICE_STD` | スタンダードプランの Price ID |
| `STRIPE_PRICE_BIZ` | ビジネスプランの Price ID |

## ローカル起動

```bash
npm install
echo "ANTHROPIC_API_KEY=your_key" > .env.local
npm run dev
```

## デプロイ

```bash
npx vercel --prod
```
