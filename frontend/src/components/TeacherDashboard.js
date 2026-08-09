import React, { useEffect, useState } from "react";
import { panel, eyebrow, h2 } from "../theme";
import { listenAllEngagement } from "../store";

// Demo class roster — in production these would be real enrolled students.
const CLASS_ROSTER = [
  { id: "demo-student-1", name: "Aarav P." },
  { id: "student-2", name: "Meera K." },
  { id: "student-3", name: "Divya S." },
  { id: "student-4", name: "Rohan T." },
];

export default function TeacherDashboard() {
  const [engagement, setEngagement] = useState([]);

  useEffect(() => {
    try {
      const unsub = listenAllEngagement(setEngagement);
      return () => unsub();
    } catch (err) {
      console.warn("Dashboard unavailable — check Firebase config.", err);
    }
  }, []);

  const rows = CLASS_ROSTER.map((s) => {
    const records = engagement.filter((e) => e.studentId === s.id);
    const avgScore = records.length ? Math.round(records.reduce((sum, r) => sum + r.rollingScore, 0) / records.length) : null;
    return { ...s, avgScore, subjects: records.length };
  });

  const flagged = rows.filter((r) => r.avgScore !== null && r.avgScore < 50);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div>
        <div style={eyebrow}>TEACHER VIEW · CLASS-WIDE ENGAGEMENT</div>
        <h2 style={{ ...h2, margin: "4px 0" }}>Not "who used AI" — who's still learning</h2>
        <p style={{ fontSize: 13, opacity: 0.6, margin: 0 }}>AI usage volume alone tells you nothing useful. This does.</p>
      </div>

      {flagged.length > 0 && (
        <div style={{ ...panel, background: "rgba(229,72,77,0.06)", border: "1px solid rgba(229,72,77,0.2)" }}>
          <div style={{ ...eyebrow, color: "var(--danger)" }}>EARLY FLAG</div>
          <p style={{ fontSize: 13, margin: "4px 0 0" }}>
            {flagged.map((f) => f.name).join(", ")} showing low engagement scores — worth a check-in before it shows up in test results.
          </p>
        </div>
      )}

      <div style={{ display: "grid", gap: 10 }}>
        {rows.map((r) => (
          <div key={r.id} style={{ ...panel, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%", background: "var(--deep)", color: "var(--spark)",
              display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Sora", fontWeight: 700, fontSize: 13,
            }}>
              {r.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--deep)" }}>{r.name}</div>
              <div style={{ fontSize: 11.5, opacity: 0.5 }}>{r.subjects} subject{r.subjects === 1 ? "" : "s"} tracked</div>
            </div>
            {r.avgScore !== null ? (
              <div style={{
                fontFamily: "IBM Plex Mono", fontSize: 18, fontWeight: 700,
                color: r.avgScore >= 70 ? "var(--violet)" : r.avgScore >= 50 ? "var(--amber)" : "var(--danger)",
              }}>{r.avgScore}</div>
            ) : (
              <div style={{ fontSize: 11.5, opacity: 0.4 }}>No data yet</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
