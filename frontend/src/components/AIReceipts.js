import React, { useEffect, useState } from "react";
import { panel, eyebrow, h2 } from "../theme";
import { listenReceipts } from "../store";

// "AI receipts" — reframes AI use from something to hide into a normal,
// transparent, trackable part of learning. Not punitive, just visible.
export default function AIReceipts({ studentId }) {
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    try {
      const unsub = listenReceipts(studentId, setReceipts);
      return () => unsub();
    } catch (err) {
      console.warn("Receipts unavailable — check Firebase config.", err);
    }
  }, [studentId]);

  const resolved = receipts.filter((r) => r.stage === "resolved");

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div>
        <div style={eyebrow}>AI RECEIPTS · TRANSPARENT, NOT PUNITIVE</div>
        <h2 style={{ ...h2, margin: "4px 0" }}>Your AI usage, made visible</h2>
        <p style={{ fontSize: 13, opacity: 0.6, margin: 0 }}>Every AI-assisted session, and whether it led to real understanding.</p>
      </div>
      {resolved.length === 0 && <div style={{ ...panel, fontSize: 13, opacity: 0.6 }}>No sessions yet — complete a checkpoint to see receipts here.</div>}
      {resolved.map((r) => (
        <div key={r.id} style={panel}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--deep)", fontFamily: "Sora" }}>{r.question}</div>
              <div style={{ fontSize: 11.5, opacity: 0.5, marginTop: 2 }}>{r.subject} · {new Date(r.timestamp).toLocaleString()}</div>
            </div>
            <div style={{
              fontFamily: "IBM Plex Mono", fontSize: 13, fontWeight: 700,
              color: r.sessionScore >= 70 ? "var(--violet)" : "var(--amber)",
            }}>{r.sessionScore}</div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8, fontSize: 11 }}>
            <Tag ok={r.twinCorrect} label="Twin problem" />
            <Tag ok={r.followUpPassed} label="Follow-up" />
            <Tag ok={r.explanationScore > 0.5} label="Explanation" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Tag({ ok, label }) {
  return (
    <span style={{
      padding: "3px 8px", borderRadius: 99,
      background: ok ? "rgba(108,92,231,0.1)" : "rgba(229,72,77,0.08)",
      color: ok ? "var(--violet)" : "var(--danger)", fontWeight: 600,
    }}>
      {ok ? "✓" : "✗"} {label}
    </span>
  );
}
