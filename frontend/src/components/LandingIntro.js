import React, { useEffect, useState } from "react";

const KEYFRAMES = `
@keyframes cfBlobFloat1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,-30px) scale(1.08); } }
@keyframes cfBlobFloat2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-50px,20px) scale(1.12); } }
@keyframes cfBlobFloat3 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(20px,40px) scale(0.95); } }
@keyframes cfFadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
@keyframes cfPulseGlow { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
@keyframes cfFlowDot { 0% { transform: translateX(0); opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translateX(calc(100% - 10px)); opacity: 0; } }
@keyframes cfGradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
`;

const FEATURES = [
  { icon: "🎯", title: "Try it yourself first", desc: "Struggle before AI — the healthy default, not an afterthought." },
  { icon: "🤔", title: "Confused-kid follow-up", desc: "A one-line question that catches shallow rephrasing instantly." },
  { icon: "🧪", title: "Twin problem, no AI", desc: "The hardest signal to fake — new scenario, same concept, solved solo." },
  { icon: "📊", title: "Trend, not a leaderboard", desc: "Your own engagement curve over time — no shame, just signal." },
  { icon: "🧾", title: "Transparent AI receipts", desc: "Every AI session logged openly — normalized, not hidden." },
  { icon: "👩‍🏫", title: "Teacher early-warning", desc: "Flags who's disengaging weeks before a test would show it." },
];

const FLOW_STEPS = ["Attempt", "AI help", "Explain", "Follow-up", "Twin test", "Score"];

export default function LandingIntro({ theme, dark, onToggleDark, onStart }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = KEYFRAMES;
    document.head.appendChild(styleTag);
    const t = setTimeout(() => setVisible(true), 50);
    return () => { document.head.removeChild(styleTag); clearTimeout(t); };
  }, []);

  return (
    <div style={{ ...theme, minHeight: "100vh", background: "var(--deep)", color: "var(--mist)", fontFamily: "Inter, sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-10%", left: "-5%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(108,92,231,0.35), transparent 70%)", filter: "blur(40px)", animation: "cfBlobFloat1 14s ease-in-out infinite" }} />
        <div style={{ position: "absolute", top: "20%", right: "-10%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(198,255,61,0.18), transparent 70%)", filter: "blur(50px)", animation: "cfBlobFloat2 18s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "-15%", left: "25%", width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, rgba(108,92,231,0.25), transparent 70%)", filter: "blur(45px)", animation: "cfBlobFloat3 16s ease-in-out infinite" }} />
        <div style={{
          position: "absolute", inset: 0, opacity: 0.05,
          backgroundImage: "linear-gradient(rgba(244,242,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(244,242,250,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--spark)", boxShadow: "0 0 12px var(--spark)", animation: "cfPulseGlow 2s ease infinite" }} />
          CognifyAI
        </div>
        <button onClick={onToggleDark} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 99, padding: "7px 12px", cursor: "pointer", fontSize: 13, color: "var(--mist)" }}>
          {dark ? "☀️" : "🌙"}
        </button>
      </div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 780, margin: "0 auto", textAlign: "center", padding: "48px 24px 20px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "IBM Plex Mono", fontSize: 11.5,
          letterSpacing: "0.08em", color: "var(--spark)", background: "rgba(198,255,61,0.08)",
          border: "1px solid rgba(198,255,61,0.25)", borderRadius: 99, padding: "6px 14px", marginBottom: 24,
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)", transition: "all 0.5s ease",
        }}>
          ⚡ NOT ANOTHER AI DETECTOR — A THIRD PATH
        </div>

        <h1 style={{
          fontFamily: "Sora", fontSize: "clamp(32px, 5vw, 50px)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 20px",
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "all 0.6s ease 0.1s",
        }}>
          Students copy AI answers.<br />
          <span style={{
            background: "linear-gradient(90deg, var(--spark), #8FE562, var(--spark))",
            backgroundSize: "200% auto", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
            animation: "cfGradientShift 4s ease infinite",
          }}>
            Understanding quietly disappears.
          </span>
        </h1>

        <p style={{
          fontSize: 15.5, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 34px",
          transitionDelay: "0.2s", transition: "all 0.6s ease", transform: visible ? "translateY(0)" : "translateY(12px)", opacity: visible ? 0.65 : 0,
        }}>
          Banning AI doesn't work. Detecting AI-written text is a losing arms race.
          CognifyAI makes AI-assisted answers <b style={{ color: "var(--mist)", opacity: 1 }}>structurally require real understanding</b> before they count as done.
        </p>

        <div style={{
          display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap",
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "all 0.6s ease 0.3s",
        }}>
          <button
            onClick={onStart}
            style={{
              background: "var(--violet)", color: "#fff", border: "none", padding: "15px 30px", borderRadius: 14,
              fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "Inter",
              boxShadow: "0 8px 30px rgba(108,92,231,0.4)", transition: "transform 0.15s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            Try the checkpoint flow →
          </button>
          <a href="#how-it-works" style={{
            background: "rgba(255,255,255,0.06)", color: "var(--mist)", border: "1px solid rgba(255,255,255,0.12)",
            padding: "15px 24px", borderRadius: 14, fontWeight: 600, fontSize: 14, textDecoration: "none",
            display: "flex", alignItems: "center",
          }}>
            See how it works ↓
          </a>
        </div>
      </div>

      <div style={{
        position: "relative", zIndex: 2, maxWidth: 640, margin: "44px auto 0", padding: "0 24px",
        opacity: visible ? 1 : 0, transition: "opacity 0.6s ease 0.4s",
      }}>
        <div style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18,
          padding: "18px 22px", backdropFilter: "blur(10px)",
        }}>
          <div style={{ fontFamily: "IBM Plex Mono", fontSize: 10, letterSpacing: "0.08em", opacity: 0.4, marginBottom: 12, textAlign: "center" }}>
            THE CHECKPOINT GAUNTLET
          </div>
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ position: "absolute", top: "50%", left: 14, right: 14, height: 2, background: "rgba(255,255,255,0.1)", transform: "translateY(-50%)" }} />
            <div style={{ position: "absolute", top: "50%", left: 14, width: 10, height: 10, borderRadius: "50%", background: "var(--spark)", boxShadow: "0 0 10px var(--spark)", animation: "cfFlowDot 5s linear infinite" }} />
            {FLOW_STEPS.map((s, i) => (
              <div key={s} style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--deep)", border: "2px solid var(--violet)" }} />
                <div style={{ fontSize: 10, fontFamily: "IBM Plex Mono", opacity: 0.55, whiteSpace: "nowrap" }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="how-it-works" style={{ position: "relative", zIndex: 2, maxWidth: 900, margin: "70px auto 0", padding: "0 24px 70px" }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div style={{ fontFamily: "IBM Plex Mono", fontSize: 10.5, letterSpacing: "0.08em", opacity: 0.45, marginBottom: 8 }}>WHAT MAKES IT DIFFERENT</div>
          <h2 style={{ fontFamily: "Sora", fontSize: 24, fontWeight: 700, margin: 0 }}>Six things nobody else is doing</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14 }}>
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16,
                padding: "20px 20px", transition: "all 0.25s ease", cursor: "default",
                opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(14px)",
                transitionDelay: `${0.05 * i}s`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = "rgba(198,255,61,0.3)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ fontSize: 22, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 14.5, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 12.5, opacity: 0.6, lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 44 }}>
          <button
            onClick={onStart}
            style={{
              background: "var(--deep)", color: "var(--spark)", border: "1px solid rgba(198,255,61,0.3)",
              padding: "14px 28px", borderRadius: 14, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "Inter",
            }}
          >
            Start the live demo →
          </button>
        </div>
      </div>
    </div>
  );
}