import React, { useState, useEffect } from "react";
import { theme, secondaryBtn } from "./theme";
import CheckpointFlow from "./components/CheckpointFlow";
import AIReceipts from "./components/AIReceipts";
import EngagementTrend from "./components/EngagementTrend";
import TeacherDashboard from "./components/TeacherDashboard";
import LandingIntro from "./components/LandingIntro";
import JudgeChallengeMode from "./components/JudgeChallengeMode";
import CognitiveFingerprint from "./components/CognitiveFingerprint";

const STUDENT_ID = "demo-student-1";

const tabBtn = (active) => ({
  border: "none", padding: "9px 16px", borderRadius: 99, fontSize: 12.5, fontWeight: 700, cursor: "pointer",
  background: active ? "var(--deep)" : "transparent", color: active ? "var(--spark)" : "var(--deep)",
  transition: "all 0.2s ease", whiteSpace: "nowrap",
});

const GLOBAL_KEYFRAMES = `
@keyframes cognifyFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
@keyframes cognifyPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
@keyframes cognifyBlobA { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-20px) scale(1.06); } }
@keyframes cognifyBlobB { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-30px,25px) scale(1.08); } }
`;

export default function App() {
  const [dark, setDark] = useState(false);
  const [started, setStarted] = useState(false);
  const [tab, setTab] = useState("practice");
  const [refreshKey, setRefreshKey] = useState(0);
  const t = theme(dark);

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = GLOBAL_KEYFRAMES;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  }, []);

  if (!started) {
    return <LandingIntro theme={t} dark={dark} onToggleDark={() => setDark((d) => !d)} onStart={() => setStarted(true)} />;
  }

  return (
    <div style={{ ...t, minHeight: "100vh", background: "var(--mist)", fontFamily: "Inter, sans-serif", position: "relative", overflow: "hidden", transition: "background 0.3s ease" }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "-8%", right: "-8%", width: 420, height: 420, borderRadius: "50%",
          background: dark ? "radial-gradient(circle, rgba(108,92,231,0.28), transparent 70%)" : "radial-gradient(circle, rgba(108,92,231,0.12), transparent 70%)",
          filter: "blur(50px)", animation: "cognifyBlobA 16s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "-10%", left: "-8%", width: 380, height: 380, borderRadius: "50%",
          background: dark ? "radial-gradient(circle, rgba(198,255,61,0.12), transparent 70%)" : "radial-gradient(circle, rgba(198,255,61,0.10), transparent 70%)",
          filter: "blur(50px)", animation: "cognifyBlobB 20s ease-in-out infinite",
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 560, margin: "0 auto", padding: "28px 16px 60px", display: "grid", gap: 20 }}>
        <div style={{
          background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 20,
          padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 12, boxShadow: dark ? "none" : "0 4px 24px rgba(27,23,48,0.05)",
        }}>
          <div>
            <div
              onClick={() => setStarted(false)}
              style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 21, color: "var(--deep)", display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--spark)", boxShadow: "0 0 10px var(--spark)" }} />
              CognifyAI
            </div>
            <div style={{ fontSize: 11.5, color: "var(--deep)", opacity: 0.5, marginTop: 1 }}>Prove you understood it — not just that you pasted it.</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setDark((d) => !d)} title="Toggle dark mode" style={{ ...secondaryBtn, padding: "8px 10px", fontSize: 14, lineHeight: 1 }}>
              {dark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        <div style={{
          display: "flex", gap: 3, background: dark ? "rgba(244,242,250,0.06)" : "rgba(27,23,48,0.05)",
          borderRadius: 99, padding: 4, overflowX: "auto",
        }}>
          <button style={{ ...tabBtn(tab === "practice"), flex: 1 }} onClick={() => setTab("practice")}>Practice</button>
          <button style={{ ...tabBtn(tab === "receipts"), flex: 1 }} onClick={() => setTab("receipts")}>Receipts</button>
          <button style={{ ...tabBtn(tab === "trend"), flex: 1 }} onClick={() => setTab("trend")}>My Trend</button>
          <button style={{ ...tabBtn(tab === "teacher"), flex: 1 }} onClick={() => setTab("teacher")}>Teacher</button>
          <button style={{ ...tabBtn(tab === "judge"), flex: 1 }} onClick={() => setTab("judge")}>🎓 Judge Mode</button>
        </div>

        <div key={tab} style={{ animation: "cognifyFadeIn 0.35s ease" }}>
          {tab === "practice" && <CheckpointFlow studentId={STUDENT_ID} onSessionComplete={() => setRefreshKey((k) => k + 1)} />}
          {tab === "receipts" && <AIReceipts key={refreshKey} studentId={STUDENT_ID} />}
          {tab === "trend" && (
            <div style={{ display: "grid", gap: 16 }} key={refreshKey}>
              <EngagementTrend studentId={STUDENT_ID} subject="Algebra" />
              <CognitiveFingerprint studentId={STUDENT_ID} />
            </div>
          )}
          {tab === "teacher" && <TeacherDashboard key={refreshKey} />}
          {tab === "judge" && <JudgeChallengeMode />}
        </div>
      </div>
    </div>
  );
}