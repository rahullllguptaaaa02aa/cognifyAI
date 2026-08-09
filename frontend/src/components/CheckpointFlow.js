import React, { useState, useEffect } from "react";
import { panel, eyebrow, h2, primaryBtn, secondaryBtn } from "../theme";
import { computeSessionScore, updateRollingScore, isSuspiciouslyFast } from "../engagementEngine";
import { logAIReceipt, saveSessionScore, getRollingScore } from "../store";
import { api } from "../api";
import SparkBurst from "./SparkBurst";
import ExplanationDiff from "./ExplanationDiff";

const TOPIC_ICONS = {
  dsa: "🧩", oops: "🏗️", dbms: "🗄️", os: "🖥️", cn: "🌐",
  aptitude: "🔢", hr: "🗣️", "system-design": "🏛️",
};

const DEFAULT_TOPICS = [
  { id: "dsa", label: "Data Structures & Algorithms" },
  { id: "oops", label: "OOP Concepts" },
  { id: "dbms", label: "DBMS" },
  { id: "os", label: "Operating Systems" },
  { id: "cn", label: "Computer Networks" },
  { id: "aptitude", label: "Quantitative Aptitude" },
  { id: "hr", label: "HR / Behavioral" },
  { id: "system-design", label: "System Design Basics" },
];

const STAGE_ORDER = ["topic", "question", "ai-answer", "followup", "twin", "confidence", "result"];

function ProgressStepper({ stage }) {
  const idx = Math.max(0, STAGE_ORDER.indexOf(stage === "loading-q" ? "question" : stage === "self-result" ? "result" : stage));
  return (
    <div style={{ display: "flex", gap: 5, marginBottom: 2 }}>
      {STAGE_ORDER.map((s, i) => (
        <div key={s} style={{
          height: 4, flex: 1, borderRadius: 99,
          background: i <= idx ? "var(--violet)" : "var(--line)",
          transition: "background 0.3s ease",
        }} />
      ))}
    </div>
  );
}

function LiveTimer({ startedAt }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, []);
  const seconds = ((now - startedAt) / 1000).toFixed(1);
  return (
    <span style={{ fontFamily: "IBM Plex Mono", fontSize: 11, opacity: 0.6 }}>⏱ {seconds}s</span>
  );
}

export default function CheckpointFlow({ studentId, onSessionComplete }) {
  const [topics, setTopics] = useState(DEFAULT_TOPICS);
  const [topicId, setTopicId] = useState("dsa");
  const [stage, setStage] = useState("topic");
  const [current, setCurrent] = useState(null);
  const [aiSource, setAiSource] = useState(null);

  const [explanation, setExplanation] = useState("");
  const [explanationScore, setExplanationScore] = useState(0);
  const [followUp, setFollowUp] = useState("");
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [followUpPassed, setFollowUpPassed] = useState(false);
  const [twin, setTwin] = useState(null);
  const [twinAnswer, setTwinAnswer] = useState("");
  const [twinCorrect, setTwinCorrect] = useState(false);
  const [twinFeedback, setTwinFeedback] = useState("");
  const [confidence, setConfidence] = useState(70);
  const [finalScore, setFinalScore] = useState(null);
  const [showSpark, setShowSpark] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [selfAttempt, setSelfAttempt] = useState("");
  const [selfCorrect, setSelfCorrect] = useState(false);
  const [selfFeedback, setSelfFeedback] = useState("");
  const [twinShownAt, setTwinShownAt] = useState(null);
  const [twinElapsedMs, setTwinElapsedMs] = useState(null);

  useEffect(() => {
    api.getTopics().then((r) => setTopics(r.topics)).catch(() => {});
  }, []);

  const startTopic = async () => {
    setStage("loading-q");
    setBusy(true);
    setError(null);
    try {
      const q = await api.getQuestion(topicId);
      setCurrent(q);
      setAiSource(q.source);
      setStage("question");
    } catch (err) {
      setError("Couldn't reach the backend. Is it running on localhost:5000?");
      setStage("topic");
    }
    setBusy(false);
  };

  const submitSelfAttempt = async () => {
    setBusy(true);
    setError(null);
    try {
      const result = await api.checkTwinAnswer(current.question, current.aiAnswer, [], selfAttempt);
      setSelfCorrect(result.correct);
      setSelfFeedback(result.feedback || (result.correct ? "Solid — you didn't need AI for this one." : "Not quite right — let's see what AI would say."));
      setAiSource(result.source);
      if (result.correct) {
        logAIReceipt(studentId, { question: current.question, subject: current.topic, stage: "self-solved", correct: true }).catch(() => {});
        const session = 100;
        setFinalScore(session);
        const prevRolling = await getRollingScore(studentId, current.topic).catch(() => null);
        const rolling = updateRollingScore(prevRolling, session);
        await saveSessionScore(studentId, current.topic, session, rolling).catch(() => {});
        setShowSpark(true);
        onSessionComplete?.();
      }
      setStage("self-result");
    } catch (err) {
      setError("AI grading failed — check your backend/.env GROQ_API_KEY.");
    }
    setBusy(false);
  };

  const askAI = () => {
    logAIReceipt(studentId, { question: current.question, subject: current.topic, aiAnswer: current.aiAnswer, stage: "asked" }).catch(() => {});
    setStage("ai-answer");
  };

  const submitExplanation = async () => {
    setBusy(true);
    try {
      const result = await api.scoreExplanation(current.question, current.aiAnswer, explanation);
      setExplanationScore(result.score);
      setAiSource(result.source);
      const fu = await api.getFollowUp(current.question, current.aiAnswer, explanation);
      setFollowUp(fu.followUp);
      setStage("followup");
    } catch (err) {
      setError("AI call failed — check your backend/.env GROQ_API_KEY.");
    }
    setBusy(false);
  };

  const submitFollowUp = async () => {
    setBusy(true);
    const passed = followUpAnswer.trim().split(/\s+/).length >= 4;
    setFollowUpPassed(passed);
    try {
      const t = await api.getTwinProblem(current.question, current.topic);
      setTwin(t);
      setAiSource(t.source);
      setTwinShownAt(Date.now());
      setStage("twin");
    } catch (err) {
      setError("AI call failed — check your backend/.env GROQ_API_KEY.");
    }
    setBusy(false);
  };

  const submitTwin = async () => {
    setBusy(true);
    const elapsed = twinShownAt ? Date.now() - twinShownAt : null;
    setTwinElapsedMs(elapsed);
    try {
      const result = await api.checkTwinAnswer(twin.twinQuestion, twin.expectedAnswer, twin.keyPoints, twinAnswer);
      setTwinCorrect(result.correct);
      setTwinFeedback(result.feedback);
      setAiSource(result.source);
      setStage("confidence");
    } catch (err) {
      setError("AI call failed — check your backend/.env GROQ_API_KEY.");
    }
    setBusy(false);
  };

  const submitConfidence = async () => {
    const suspicious = twinElapsedMs !== null && isSuspiciouslyFast(twinElapsedMs);
    const session = computeSessionScore({
      explanationScore, kidFollowUpPassed: followUpPassed, twinProblemCorrect: twinCorrect && !suspicious,
      confidence, actuallyCorrect: twinCorrect,
    });
    setFinalScore(session);
    const prevRolling = await getRollingScore(studentId, current.topic).catch(() => null);
    const rolling = updateRollingScore(prevRolling, session);
    await saveSessionScore(studentId, current.topic, session, rolling, {
      explanationScore, followUpPassed, twinCorrect, confidence, twinElapsedMs, suspicious,
    }).catch(() => {});
    await logAIReceipt(studentId, {
      question: current.question, subject: current.topic, aiAnswer: current.aiAnswer,
      stage: "resolved", explanationScore, followUpPassed, twinCorrect, sessionScore: session,
      twinElapsedMs, suspicious,
    }).catch(() => {});
    if (session >= 70 && !suspicious) setShowSpark(true);
    setStage("result");
    onSessionComplete?.();
  };

  const reset = () => {
    setStage("topic"); setCurrent(null); setExplanation(""); setFollowUpAnswer("");
    setTwinAnswer(""); setConfidence(70); setFinalScore(null); setShowSpark(false); setError(null);
    setSelfAttempt(""); setSelfCorrect(false); setSelfFeedback("");
    setTwinShownAt(null); setTwinElapsedMs(null);
  };

  return (
    <div style={{ display: "grid", gap: 14, position: "relative" }}>
      {showSpark && <SparkBurst />}
      <ProgressStepper stage={stage} />

      {aiSource && stage !== "topic" && stage !== "result" && (
        <div style={{ fontSize: 11, fontWeight: 600, color: aiSource === "live" ? "var(--violet)" : "var(--amber)", textAlign: "right" }}>
          {aiSource === "live" ? "● Live Groq response" : "● Offline fallback (Groq unreachable)"}
        </div>
      )}
      {error && <div style={{ ...panel, background: "rgba(229,72,77,0.06)", border: "1px solid rgba(229,72,77,0.2)", fontSize: 12.5, color: "var(--danger)" }}>{error}</div>}

      {stage === "topic" && (
        <div style={panel}>
          <div style={eyebrow}>PLACEMENT PREP · PICK A TOPIC</div>
          <h2 style={{ ...h2, margin: "6px 0 16px" }}>What are you preparing today?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginBottom: 16 }}>
            {topics.map((t) => {
              const active = topicId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTopicId(t.id)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8,
                    padding: "14px 14px", borderRadius: 14, cursor: "pointer", textAlign: "left",
                    background: active ? "var(--violet)" : "var(--mist)",
                    border: active ? "1px solid var(--violet)" : "1px solid var(--line)",
                    color: active ? "#fff" : "var(--deep)",
                    transition: "all 0.18s ease",
                    transform: active ? "translateY(-2px)" : "translateY(0)",
                    boxShadow: active ? "0 6px 20px rgba(108,92,231,0.35)" : "none",
                  }}
                >
                  <span style={{ fontSize: 20 }}>{TOPIC_ICONS[t.id] || "📘"}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 700, lineHeight: 1.3 }}>{t.label}</span>
                </button>
              );
            })}
          </div>
          <button style={{ ...primaryBtn, width: "100%" }} onClick={startTopic} disabled={busy}>
            {busy ? "Generating question…" : "Start →"}
          </button>
        </div>
      )}

      {stage === "loading-q" && (
        <div style={{ ...panel, textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 8 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--violet)", animation: "cognifyPulse 1s ease infinite", animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
          <div style={{ fontSize: 13, opacity: 0.6 }}>Groq is generating a fresh question…</div>
        </div>
      )}

      {current && stage !== "topic" && stage !== "loading-q" && (
        <div>
          <div style={eyebrow}>UNDERSTANDING CHECKPOINT · {current.topic}</div>
          <h2 style={{ ...h2, margin: "4px 0" }}>{current.question}</h2>
        </div>
      )}

      {stage === "question" && (
        <div style={{ display: "grid", gap: 12 }}>
          <div style={panel}>
            <div style={eyebrow}>TRY IT YOURSELF FIRST</div>
            <p style={{ fontSize: 13, opacity: 0.7, margin: "6px 0 10px" }}>Give it a real attempt before reaching for AI — productive struggle is part of learning.</p>
            <textarea value={selfAttempt} onChange={(e) => setSelfAttempt(e.target.value)} rows={3}
              placeholder="Type your own answer here…"
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid var(--line)", fontFamily: "Inter", fontSize: 14, resize: "vertical", background: "var(--surface)", color: "var(--deep)" }} />
            <button style={{ ...primaryBtn, marginTop: 10 }} onClick={submitSelfAttempt} disabled={selfAttempt.trim().length < 3 || busy}>
              {busy ? "Groq is grading…" : "Check my answer →"}
            </button>
          </div>
          <div style={{ textAlign: "center", fontSize: 11.5, opacity: 0.4, fontFamily: "IBM Plex Mono" }}>— or —</div>
          <div style={panel}>
            <p style={{ fontSize: 13, opacity: 0.7, margin: "0 0 12px" }}>Still stuck? Ask AI — but you'll need to prove you actually understood the answer.</p>
            <button style={secondaryBtn} onClick={askAI}>Ask AI for help</button>
          </div>
        </div>
      )}

      {stage === "self-result" && (
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ ...panel, textAlign: "center" }}>
            <div style={eyebrow}>{selfCorrect ? "✓ NICE — YOU GOT IT YOURSELF" : "NOT QUITE"}</div>
            <p style={{ fontSize: 13, opacity: 0.7, margin: "8px 0 0" }}>{selfFeedback}</p>
          </div>
          {selfCorrect ? (
            <button style={secondaryBtn} onClick={reset}>Try another topic →</button>
          ) : (
            <button style={primaryBtn} onClick={askAI}>See the AI's explanation →</button>
          )}
        </div>
      )}

      {stage === "ai-answer" && (
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ ...panel, background: "var(--mist)" }}>
            <div style={eyebrow}>AI SAYS</div>
            <p style={{ fontSize: 14, margin: "6px 0 0", lineHeight: 1.6 }}>{current.aiAnswer}</p>
          </div>
          <div style={panel}>
            <div style={eyebrow}>NOW EXPLAIN IT BACK — IN YOUR OWN WORDS</div>
            <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={3}
              placeholder="What did the AI just explain? Say it your way…"
              style={{ width: "100%", marginTop: 8, padding: 10, borderRadius: 10, border: "1px solid rgba(27,23,48,0.15)", fontFamily: "Inter", fontSize: 14, resize: "vertical" }} />
            <button style={{ ...primaryBtn, marginTop: 10 }} onClick={submitExplanation} disabled={explanation.trim().length < 5 || busy}>
              {busy ? "Groq is checking…" : "Submit explanation →"}
            </button>
          </div>
        </div>
      )}

      {stage === "followup" && (
        <div style={panel}>
          <div style={eyebrow}>🤔 CONFUSED-KID FOLLOW-UP</div>
          <p style={{ fontFamily: "Sora", fontSize: 16, fontWeight: 600, margin: "8px 0", color: "var(--deep)" }}>{followUp}</p>
          <textarea value={followUpAnswer} onChange={(e) => setFollowUpAnswer(e.target.value)} rows={2}
            placeholder="Answer the follow-up…"
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid rgba(27,23,48,0.15)", fontFamily: "Inter", fontSize: 14, resize: "vertical" }} />
          <button style={{ ...primaryBtn, marginTop: 10 }} onClick={submitFollowUp} disabled={followUpAnswer.trim().length < 3 || busy}>
            {busy ? "Generating twin problem (Groq)…" : "Answer →"}
          </button>
        </div>
      )}

      {stage === "twin" && twin && (
        <div style={{ ...panel, animation: "cognifyFadeIn 0.35s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={eyebrow}>🧪 TWIN PROBLEM · NO AI ALLOWED</div>
            {twinShownAt && <LiveTimer startedAt={twinShownAt} />}
          </div>
          <div style={{
            fontSize: 11.5, color: "var(--spark)", background: "var(--deep)", padding: "8px 12px",
            borderRadius: 8, margin: "8px 0 10px", fontFamily: "IBM Plex Mono", lineHeight: 1.5,
          }}>
            💡 This is the one step AI can't do for you — solve it yourself, no help this time.
          </div>
          <div style={{ fontFamily: "Sora", fontSize: 16, fontWeight: 600, color: "var(--deep)", marginBottom: 10 }}>{twin.twinQuestion}</div>
          <textarea value={twinAnswer} onChange={(e) => setTwinAnswer(e.target.value)} rows={3} placeholder="Your answer"
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid rgba(27,23,48,0.15)", fontFamily: "Inter", fontSize: 14, resize: "vertical" }} />
          <button style={{ ...primaryBtn, marginTop: 10 }} onClick={submitTwin} disabled={!twinAnswer.trim() || busy}>
            {busy ? "Groq is grading…" : "Submit answer →"}
          </button>
        </div>
      )}

      {stage === "confidence" && (
        <div style={panel}>
          <div style={eyebrow}>HOW CONFIDENT ARE YOU?</div>
          <p style={{ fontSize: 12.5, opacity: 0.65, margin: "4px 0 12px" }}>Before we reveal — how sure are you that your twin-problem answer is correct?</p>
          <input type="range" min="0" max="100" value={confidence} onChange={(e) => setConfidence(Number(e.target.value))} style={{ width: "100%" }} />
          <div style={{ textAlign: "center", fontFamily: "IBM Plex Mono", fontSize: 20, color: "var(--violet)", fontWeight: 700, margin: "8px 0" }}>{confidence}%</div>
          <button style={primaryBtn} onClick={submitConfidence}>Reveal result →</button>
        </div>
      )}

      {stage === "result" && finalScore !== null && (
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ ...panel, textAlign: "center" }}>
            <div style={eyebrow}>SESSION SCORE</div>
            <div style={{ fontFamily: "Sora", fontSize: 44, fontWeight: 800, color: finalScore >= 70 ? "var(--violet)" : "var(--amber)", margin: "6px 0" }}>{finalScore}</div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>{twinFeedback || (twinCorrect ? "✓ Twin problem solved — real understanding confirmed." : "✗ Twin problem missed.")}</div>
          </div>

          {twinElapsedMs !== null && isSuspiciouslyFast(twinElapsedMs) && (
            <div style={{ ...panel, background: "rgba(224,151,59,0.08)", border: "1px solid rgba(224,151,59,0.3)" }}>
              <div style={{ ...eyebrow, color: "var(--amber)" }}>⚠️ TIMING FLAG</div>
              <p style={{ fontSize: 12.5, margin: "4px 0 0", opacity: 0.8 }}>
                Twin problem solved in {(twinElapsedMs / 1000).toFixed(1)}s — unusually fast for genuine re-application.
                Twin credit reduced in this session's score. Not a punishment, just a transparent signal.
              </p>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <ScoreChip label="Explanation" value={`${Math.round(explanationScore * 100)}%`} />
            <ScoreChip label="Follow-up" value={followUpPassed ? "Passed" : "Weak"} />
            <ScoreChip label="Twin problem" value={twinCorrect ? "Correct" : "Missed"} />
            <ScoreChip label="Calibration" value={`${confidence}% confident`} />
          </div>

          {explanation && current && (
            <div style={panel}>
              <ExplanationDiff aiAnswer={current.aiAnswer} studentExplanation={explanation} />
            </div>
          )}

          <button style={secondaryBtn} onClick={reset}>Try another topic →</button>
        </div>
      )}
    </div>
  );
}

function ScoreChip({ label, value }) {
  return (
    <div style={{ ...panel, padding: "12px 14px" }}>
      <div style={{ fontSize: 10.5, opacity: 0.5, fontFamily: "IBM Plex Mono", letterSpacing: "0.06em" }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--deep)", marginTop: 2 }}>{value}</div>
    </div>
  );
}