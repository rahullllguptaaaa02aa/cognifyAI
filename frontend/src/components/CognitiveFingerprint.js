import React, { useEffect, useState } from "react";
import { panel, eyebrow, h2 } from "../theme";
import { listenAllSessions } from "../store";
import { computeFingerprint } from "../engagementEngine";

const AXES = [
  { key: "explanation", label: "Explanation" },
  { key: "followUp", label: "Follow-up" },
  { key: "twinSolve", label: "Twin-solve" },
  { key: "calibration", label: "Calibration" },
];

function axisPoint(cx, cy, radius, angle, value) {
  const rad = (angle * Math.PI) / 180;
  const r = (value / 100) * radius;
  return { x: cx + Math.cos(rad) * r, y: cy + Math.sin(rad) * r };
}

export default function CognitiveFingerprint({ studentId }) {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    try {
      const unsub = listenAllSessions(studentId, setSessions);
      return () => unsub();
    } catch (err) {
      console.warn("Fingerprint unavailable — check Firebase config.", err);
    }
  }, [studentId]);

  const fp = computeFingerprint(sessions);
  const size = 240, cx = size / 2, cy = size / 2, radius = 85;
  const angleStep = 360 / AXES.length;

  return (
    <div style={panel}>
      <div style={eyebrow}>COGNITIVE FINGERPRINT</div>
      <h2 style={{ ...h2, margin: "4px 0 4px", fontSize: 17 }}>Not one score — a shape</h2>
      <p style={{ fontSize: 12, opacity: 0.55, margin: "0 0 12px" }}>
        {fp ? `Built from ${fp.sampleSize} completed checkpoint${fp.sampleSize === 1 ? "" : "s"}.` : "Complete a few checkpoints to see your fingerprint form."}
      </p>

      {!fp ? (
        <div style={{ fontSize: 13, opacity: 0.5, textAlign: "center", padding: "20px 0" }}>No data yet.</div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {[25, 50, 75, 100].map((pct) => (
              <polygon
                key={pct}
                points={AXES.map((_, i) => {
                  const p = axisPoint(cx, cy, radius, -90 + i * angleStep, pct);
                  return `${p.x},${p.y}`;
                }).join(" ")}
                fill="none" stroke="var(--line)" strokeWidth="1"
              />
            ))}
            {AXES.map((_, i) => {
              const p = axisPoint(cx, cy, radius, -90 + i * angleStep, 100);
              return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="var(--line)" strokeWidth="1" />;
            })}
            <polygon
              points={AXES.map((a, i) => {
                const p = axisPoint(cx, cy, radius, -90 + i * angleStep, fp[a.key]);
                return `${p.x},${p.y}`;
              }).join(" ")}
              fill="rgba(198,255,61,0.25)" stroke="var(--spark)" strokeWidth="2.5"
              style={{ filter: "drop-shadow(0 0 6px rgba(198,255,61,0.4))" }}
            />
            {AXES.map((a, i) => {
              const p = axisPoint(cx, cy, radius, -90 + i * angleStep, fp[a.key]);
              return <circle key={a.key} cx={p.x} cy={p.y} r="4" fill="var(--spark)" />;
            })}
            {AXES.map((a, i) => {
              const p = axisPoint(cx, cy, radius + 22, -90 + i * angleStep, 100);
              return (
                <text key={a.key} x={p.x} y={p.y} textAnchor="middle" fontSize="10.5" fontFamily="IBM Plex Mono" fill="var(--deep)" opacity="0.65">
                  {a.label}
                </text>
              );
            })}
          </svg>
        </div>
      )}

      {fp && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginTop: 12 }}>
          {AXES.map((a) => (
            <div key={a.key} style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, padding: "6px 10px", background: "var(--mist)", borderRadius: 8 }}>
              <span style={{ opacity: 0.65 }}>{a.label}</span>
              <span style={{ fontFamily: "IBM Plex Mono", fontWeight: 700 }}>{fp[a.key]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}