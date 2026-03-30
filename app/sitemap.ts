import { MetadataRoute } from "next";

const KEYWORD_SLUGS = [
  "keiyakusho-check-ai",
  "keiyakusho-review-muryou",
  "gyoumu-itaku-keiyaku-check",
  "himitsu-hoji-keiyaku",
  "keiyakusho-bengoshi-hiyou",
  "freelance-keiyaku-chuuiten",
  "chinshaku-keiyaku-check",
  "roudou-keiyaku-check",
  "keiyakusho-template-ai",
  "risk-jyoukou-kaisetsu",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://keiyaku-review.vercel.app";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/tool`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/blog/freelance-contract-checklist`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    ...KEYWORD_SLUGS.map((slug) => ({
      url: `${base}/keywords/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${base}/legal`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];
}
