import React, { useState } from "react";
import { panel, eyebrow, h2, primaryBtn, secondaryBtn } from "../theme";
import { api } from "../api";
import ExplanationDiff from "./ExplanationDiff";

const TOPIC_ICONS = {
  dsa: "🧩", oops: "🏗️", dbms: "🗄️", os: "🖥️", cn: "🌐",
  aptitude: "🔢", hr: "🗣️", "system-design": "🏛️",
};

export default function JudgeChallengeMode() {
  const [stage, setStage] = useState("pick");
  const [topics, setTopics] = useState([]);
  const [topicId, setTopicId] = useState("dsa");
  const [current, setCurrent] = useState(null);
  const [attempt, setAttempt] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useState(() => {
    api.getTopics().then((r) => setTopics(r.topics)).catch(() => setTopics([
      { id: "dsa", label: "Data Structures & Algorithms" }, { id: "dbms", label: "DBMS" }, { id: "hr", label: "HR / Behavioral" },
    ]));
  });

  const loadQuestion = async () => {
    setBusy(true); setError(null);
    try {
      const q = await api.getQuestion(topicId);
      setCurrent(q);
      setAttempt("");
      setResult(null);
      setStage("loaded");
    } catch (err) {
      setError("Couldn't reach the backend.");
    }
    setBusy(false);
  };

  const scoreIt = async (mode) => {
    setBusy(true); setError(null);
    const text = mode === "lazy" ? current.aiAnswer : attempt;
    try {
      const scored = await api.scoreExplanation(current.question, current.aiAnswer, text);
      setResult({ text, score: scored.score, reasoning: scored.reasoning, mode });
      setStage("scored");
    } catch (err) {
      setError("AI scoring call failed — check backend/.env GROQ_API_KEY.");
    }
    setBusy(false);
  };

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div>
        <div style={{ ...eyebrow, color: "var(--violet)" }}>🎓 JUDGE CHALLENGE MODE</div>
        <h2 style={{ ...h2, margin: "4px 0" }}>Try to trick the checker</h2>
        <p style={{ fontSize: 13, opacity: 0.65, margin: 0 }}>
          Pick a topic, then try to game the scoring system yourself — paste a shallow copy, a
          clever rephrase, or a real explanation. Watch it get graded live, with the reasoning shown.
        </p>
      </div>

      {error && <div style={{ ...panel, background: "rgba(229,72,77,0.06)", border: "1px solid rgba(229,72,77,0.2)", fontSize: 12.5, color: "var(--danger)" }}>{error}</div>}

      {stage === "pick" && (
        <div style={panel}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8, marginBottom: 14 }}>
            {topics.map((t) => {
              const active = topicId === t.id;
              return (
                <button key={t.id} onClick={() => setTopicId(t.id)} style={{
                  display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6, padding: "10px 12px",
                  borderRadius: 12, cursor: "pointer", textAlign: "left",
                  background: active ? "var(--violet)" : "var(--mist)",
                  border: active ? "1px solid var(--violet)" : "1px solid var(--line)",
                  color: active ? "#fff" : "var(--deep)", transition: "all 0.15s ease",
                }}>
                  <span style={{ fontSize: 16 }}>{TOPIC_ICONS[t.id] || "📘"}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 700 }}>{t.label}</span>
                </button>
              );
            })}
          </div>
          <button style={primaryBtn} onClick={loadQuestion} disabled={busy}>{busy ? "Loading…" : "Load a question →"}</button>
        </div>
      )}

      {current && stage !== "pick" && (
        <div style={{ ...panel, background: "var(--mist)" }}>
          <div style={eyebrow}>QUESTION</div>
          <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 15, margin: "4px 0 10px" }}>{current.question}</div>
          <div style={eyebrow}>AI'S ANSWER</div>
          <p style={{ fontSize: 13.5, margin: "4px 0 0", lineHeight: 1.6 }}>{current.aiAnswer}</p>
        </div>
      )}

      {stage === "loaded" && (
        <div style={panel}>
          <div style={eyebrow}>YOUR CHALLENGE ATTEMPT</div>
          <textarea value={attempt} onChange={(e) => setAttempt(e.target.value)} rows={3}
            placeholder="Try to write something that SOUNDS like understanding but isn't…"
            style={{ width: "100%", marginTop: 8, padding: 10, borderRadius: 10, border: "1px solid var(--line)", fontFamily: "Inter", fontSize: 14, resize: "vertical" }} />
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            <button style={primaryBtn} onClick={() => scoreIt("custom")} disabled={attempt.trim().length < 3 || busy}>
              {busy ? "Scoring…" : "Score my attempt →"}
            </button>
            <button style={secondaryBtn} onClick={() => scoreIt("lazy")} disabled={busy}>
              Try pasting the AI answer verbatim
            </button>
          </div>
        </div>
      )}

      {stage === "scored" && result && (
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ ...panel, textAlign: "center" }}>
            <div style={eyebrow}>SCORE</div>
            <div style={{
              fontFamily: "Sora", fontSize: 40, fontWeight: 800, margin: "6px 0",
              color: result.score >= 0.6 ? "var(--violet)" : "var(--danger)",
            }}>
              {Math.round(result.score * 100)}
            </div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>{result.reasoning}</div>
          </div>
          <div style={panel}>
            <ExplanationDiff aiAnswer={current.aiAnswer} studentExplanation={result.text} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={secondaryBtn} onClick={() => setStage("loaded")}>Try again →</button>
            <button style={secondaryBtn} onClick={() => setStage("pick")}>New question →</button>
          </div>
        </div>
      )}
    </div>
  );
}