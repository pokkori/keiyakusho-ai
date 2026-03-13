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
        <div style={{ fontSize: 26, color: "#86efac", textAlign: "center", maxWidth: 900, marginBottom: 4, display: "flex" }}>
          契約書を貼り付けるだけ。30秒で13項目のリスク診断。
        </div>
        <div style={{ fontSize: 26, color: "#86efac", textAlign: "center", maxWidth: 900, marginBottom: 8, display: "flex" }}>
          弁護士費用¥5万 → ¥980/月。フリーランス・中小企業向け。
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
          {["13項目リスク診断", "修正提案文自動生成", "弁護士費用を90%削減"].map((label) => (
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
