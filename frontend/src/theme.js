// ---------- Design tokens ----------
// Palette: cognition/neural identity — deliberately not another blue "trust" app
// or green "growth" app. Deep violet = depth of thought; electric lime = the
// "spark" of a real understanding moment (used sparingly, only on breakthroughs).
//   --deep:    #1B1730  (near-black violet — focus, depth)
//   --spark:   #C6FF3D  (electric lime — the "aha" / breakthrough accent, used
//                         RARELY so it means something when it appears)
//   --violet:  #6C5CE7  (mid violet — primary interactive color)
//   --mist:    #F4F2FA  (pale lavender-white background)
//   --amber:   #F2A93C  (calibration/attention, not error)
//   --danger:  #E5484D
// Type:
//   Display: "Sora" (rounded-geometric, feels contemporary/AI-native without
//     being a cliché monospace-hacker aesthetic)
//   Body/UI: "Inter"
//   Data/scores: "IBM Plex Mono"
// Signature element: the "spark burst" — a small radiating glyph that appears
//   only at genuine breakthrough moments (passing a twin problem, engagement
//   score increasing) so it reads as earned, not decorative.
// ------------------------------------

export const theme = (dark) => ({
  "--deep": dark ? "#F4F2FA" : "#1B1730",
  "--spark": "#C6FF3D",
  "--violet": "#6C5CE7",
  "--mist": dark ? "#0F0D1C" : "#F4F2FA",
  "--surface": dark ? "#1B1730" : "#FFFFFF",
  "--line": dark ? "rgba(244,242,250,0.1)" : "rgba(27,23,48,0.08)",
  "--amber": "#F2A93C",
  "--danger": "#E5484D",
});

export const panel = { background: "var(--surface)", borderRadius: 18, padding: "20px 22px", border: "1px solid var(--line)", transition: "all 0.3s ease" };
export const eyebrow = { fontFamily: "IBM Plex Mono", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--deep)", opacity: 0.5, fontWeight: 500, textTransform: "uppercase" };
export const h2 = { fontFamily: "Sora", fontSize: 21, fontWeight: 700, color: "var(--deep)" };
export const primaryBtn = { background: "var(--violet)", color: "#fff", border: "none", padding: "12px 20px", borderRadius: 12, fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "Inter", transition: "transform 0.15s ease, opacity 0.15s ease" };
export const sparkBtn = { background: "var(--deep)", color: "var(--spark)", border: "none", padding: "12px 20px", borderRadius: 12, fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "Inter" };
export const secondaryBtn = { background: "transparent", color: "var(--deep)", border: "1px solid var(--line)", padding: "10px 16px", borderRadius: 12, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "Inter", transition: "all 0.15s ease" };
export const fadeIn = { animation: "cognifyFadeIn 0.35s ease" };
