import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Gaurav Rauthan | Frontend Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(135deg, #0a0a0f 0%, #0f1120 50%, #0a0a0f 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Accent glow */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            width: "600px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Name */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-3px",
            lineHeight: 1.05,
          }}
        >
          Gaurav Rauthan
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 30,
            color: "#94a3b8",
            marginTop: 20,
            letterSpacing: "-0.5px",
          }}
        >
          Frontend Developer · React · Next.js · TypeScript · GenAI
        </div>

        {/* URL chip */}
        <div
          style={{
            marginTop: 40,
            fontSize: 20,
            color: "#818cf8",
            background: "rgba(99, 102, 241, 0.1)",
            padding: "10px 28px",
            borderRadius: 10,
            border: "1px solid rgba(99, 102, 241, 0.25)",
          }}
        >
          gaurav-rauthan.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
