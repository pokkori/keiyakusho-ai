import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "契約書AIレビュー｜リスク条項・不利な表現をAIが即時チェック";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0c1a0c 0%, #14532d 50%, #166534 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 12, display: "flex" }}>📋</div>
        <div style={{ fontSize: 52, fontWeight: 700, color: "#fff", marginBottom: 12, textAlign: "center", display: "flex" }}>
          契約書AIレビュー
        </div>
        <div style={{ fontSize: 26, color: "#86efac", textAlign: "center", maxWidth: 900, marginBottom: 8, display: "flex" }}>
          リスク条項・不利な表現をAIが即時チェック・修正提案
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
          {["リスク評価", "条項解説", "修正案提示", "¥2,980/回〜"].map((label) => (
            <div
              key={label}
              style={{
                padding: "8px 20px",
                background: "rgba(134,239,172,0.15)",
                border: "1px solid rgba(134,239,172,0.3)",
                borderRadius: 24,
                fontSize: 18,
                color: "#bbf7d0",
                display: "flex",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
