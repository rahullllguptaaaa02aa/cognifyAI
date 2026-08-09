import React from "react";
import { eyebrow } from "../theme";
import { diffExplanation } from "../engagementEngine";

// Makes the scoring algorithm's reasoning visible instead of a black-box
// number — every word is marked as genuinely-the-student's-own (green) or
// echoed straight from the AI's answer (amber underline).
export default function ExplanationDiff({ aiAnswer, studentExplanation }) {
  const words = diffExplanation(aiAnswer, studentExplanation);
  const echoedCount = words.filter((w) => w.echoed).length;
  const echoedPct = Math.round((echoedCount / Math.max(words.length, 1)) * 100);

  return (
    <div>
      <div style={eyebrow}>WHY THIS SCORE · WORD-LEVEL TRANSPARENCY</div>
      <div style={{
        marginTop: 8, padding: "12px 14px", borderRadius: 10, background: "var(--mist)",
        fontSize: 13.5, lineHeight: 1.9,
      }}>
        {words.map((w, i) => (
          <span
            key={i}
            style={{
              color: w.echoed ? "var(--amber)" : "var(--deep)",
              borderBottom: w.echoed ? "2px solid var(--amber)" : "none",
              fontWeight: w.echoed ? 600 : 400,
              marginRight: 4,
            }}
          >
            {w.text}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 14, marginTop: 8, fontSize: 11, opacity: 0.6 }}>
        <span><span style={{ color: "var(--amber)", fontWeight: 700 }}>■</span> echoed from AI answer ({echoedPct}%)</span>
        <span><span style={{ color: "var(--deep)", fontWeight: 700 }}>■</span> the student's own phrasing</span>
      </div>
    </div>
  );
}