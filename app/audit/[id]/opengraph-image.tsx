import { ImageResponse } from "next/og";
import { getAuditReport } from "@/lib/store";

export const runtime = "edge";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = await getAuditReport(id);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "72px",
          background: "linear-gradient(180deg, #020617, #0f172a)",
          color: "white",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ fontSize: 22, opacity: 0.75 }}>Credex AI Spend Audit</div>
        <div style={{ marginTop: 28, fontSize: 68, fontWeight: 700, lineHeight: 1.04 }}>Public audit report</div>
        <div style={{ marginTop: 20, fontSize: 30, maxWidth: 1000, opacity: 0.9 }}>
          {report ? `Potential savings: $${Math.round(report.totals.annualSavings)} annually` : "Shareable, privacy-safe SaaS audit insights"}
        </div>
        <div style={{ marginTop: "auto", fontSize: 24, opacity: 0.7 }}>Audit ID: {id}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

