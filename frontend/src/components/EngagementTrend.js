import React, { useEffect, useState } from "react";
import { panel, eyebrow, h2 } from "../theme";
import { listenSessions } from "../store";
import { trendDirection } from "../engagementEngine";

export default function EngagementTrend({ studentId, subject = "Algebra" }) {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    try {
      const unsub = listenSessions(studentId, subject, setSessions);
      return () => unsub();
    } catch (err) {
      console.warn("Trend unavailable — check Firebase config.", err);
    }
  }, [studentId, subject]);

  const trend = trendDirection(sessions);
  const width = 460, height = 140, pad = 20;
  const points = sessions.slice(-10);

  const trendColor = trend === "declining" ? "var(--danger)" : trend === "improving" ? "var(--violet)" : "var(--amber)";
  const trendLabel = trend === "declining" ? "declining — early flag" : trend === "improving" ? "improving" : trend === "stable" ? "stable" : "not enough data yet";

  return (
    <div style={panel}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={eyebrow}>ENGAGEMENT TREND · {subject}</div>
          <h2 style={{ ...h2, margin: "4px 0", fontSize: 17 }}>Your own trend line, not a leaderboard</h2>
        </div>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: trendColor, whiteSpace: "nowrap" }}>{trendLabel}</span>
      </div>

      {points.length < 2 ? (
        <div style={{ fontSize: 12.5, opacity: 0.5, marginTop: 10 }}>Complete a few checkpoints to see your trend appear here.</div>
      ) : (
        <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ marginTop: 10 }}>
          {[0, 25, 50, 75, 100].map((v) => (
            <line key={v} x1={pad} x2={width - pad} y1={height - pad - (v / 100) * (height - pad * 2)} y2={height - pad - (v / 100) * (height - pad * 2)} stroke="rgba(27,23,48,0.06)" />
          ))}
          <polyline
            fill="none" stroke={trendColor} strokeWidth="2.5"
            points={points.map((p, i) => {
              const x = pad + (i / (points.length - 1)) * (width - pad * 2);
              const y = height - pad - (p.score / 100) * (height - pad * 2);
              return `${x},${y}`;
            }).join(" ")}
          />
          {points.map((p, i) => {
            const x = pad + (i / (points.length - 1)) * (width - pad * 2);
            const y = height - pad - (p.score / 100) * (height - pad * 2);
            return <circle key={i} cx={x} cy={y} r="3.5" fill={trendColor} />;
          })}
        </svg>
      )}
    </div>
  );
}
