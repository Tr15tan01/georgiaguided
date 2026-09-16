import { ImageResponse } from "next/og";

export const alt = "GeorgiaGuided — private journeys in Georgia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#151517", color: "#ece6dc", padding: 72 }}>
        <div style={{ fontSize: 34, color: "#c9a45c" }}>GeorgiaGuided</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, lineHeight: 1.02, fontFamily: "serif", maxWidth: 900 }}>Private journeys through Georgia</div>
          <div style={{ fontSize: 30, marginTop: 24, color: "#aaa398" }}>Tbilisi, Kazbegi, Kakheti and Svaneti</div>
        </div>
        <svg width="1056" height="90" viewBox="0 0 1056 90">
          <path d="M0 90 L120 40 L190 62 L300 12 L380 50 L470 22 L560 58 L650 8 L760 46 L850 28 L940 60 L1056 30 L1056 90 Z" fill="#6b1f3a" opacity="0.8" />
        </svg>
      </div>
    ),
    size,
  );
}
