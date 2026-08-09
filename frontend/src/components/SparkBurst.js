import React from "react";

// The signature "earned" visual — only fires on genuine breakthrough moments
// (session score 70+), never decoratively, so it carries real meaning.
export default function SparkBurst() {
  return (
    <div style={{ position: "absolute", top: -16, right: -16, pointerEvents: "none", zIndex: 5, animation: "cognifyFadeIn 0.2s ease" }}>
      <svg width="90" height="90" viewBox="0 0 90 90">
        <g stroke="var(--spark)" strokeWidth="3" strokeLinecap="round">
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 45 + Math.cos(rad) * 16, y1 = 45 + Math.sin(rad) * 16;
            const x2 = 45 + Math.cos(rad) * 36, y2 = 45 + Math.sin(rad) * 36;
            return (
              <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2}>
                <animate attributeName="opacity" values="0;1;0.3;0" dur="1.4s" begin={`${angle / 2000}s`} fill="freeze" />
              </line>
            );
          })}
        </g>
        <circle cx="45" cy="45" r="9" fill="var(--spark)">
          <animate attributeName="r" values="0;13;9" dur="0.6s" fill="freeze" />
        </circle>
      </svg>
    </div>
  );
}
