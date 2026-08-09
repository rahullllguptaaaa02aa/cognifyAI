// The scoring core. Deliberately explainable (no black box) — every factor here
// can be pointed to directly if a judge asks "why did this student's score drop."

// Heuristic explanation-quality check: does the student's own-words explanation
// actually overlap meaningfully with the AI's answer, or is it noise/copy-paste?
// (Real version: replace with an LLM semantic-similarity call — see README.)
export function scoreExplanation(aiAnswer, studentExplanation) {
  const clean = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  const aiWords = new Set(clean(aiAnswer));
  const studentWords = clean(studentExplanation);
  if (studentWords.length < 5) return 0.1; // too short to be a real explanation

  const overlap = studentWords.filter((w) => aiWords.has(w)).length;
  const overlapRatio = overlap / studentWords.length;
  const lengthScore = Math.min(studentWords.length / 25, 1);
  const notJustCopying = overlapRatio < 0.85 ? 1 : 0.4;

  return Math.round(((overlapRatio * 0.5 + lengthScore * 0.5) * notJustCopying) * 100) / 100;
}

// Twin-problem result is the strongest signal — weighted heaviest.
export function computeSessionScore({ explanationScore, kidFollowUpPassed, twinProblemCorrect, confidence, actuallyCorrect }) {
  const explanationPart = explanationScore * 25;       // 0-25
  const followUpPart = kidFollowUpPassed ? 15 : 0;       // 0-15
  const twinPart = twinProblemCorrect ? 45 : 0;          // 0-45 — the heaviest signal
  const calibrationPart = confidenceCalibrationBonus(confidence, actuallyCorrect); // 0-15
  return Math.round(explanationPart + followUpPart + twinPart + calibrationPart);
}

// Rewards accurate self-assessment, not just correctness — a confident-and-wrong
// or unsure-and-right student both reveal something useful to a teacher.
function confidenceCalibrationBonus(confidence, correct) {
  const predicted = confidence / 100;
  const actual = correct ? 1 : 0;
  const error = Math.abs(predicted - actual);
  return Math.round((1 - error) * 15);
}

// Rolling engagement score per subject — simple exponential smoothing so recent
// sessions matter more, but one bad day doesn't tank the whole trend.
export function updateRollingScore(previousScore, newSessionScore, alpha = 0.35) {
  if (previousScore == null) return newSessionScore;
  return Math.round(previousScore * (1 - alpha) + newSessionScore * alpha);
}

export function trendDirection(history) {
  if (history.length < 3) return "insufficient-data";
  const recent = history.slice(-3);
  const delta = recent[2].score - recent[0].score;
  if (delta <= -12) return "declining";
  if (delta >= 12) return "improving";
  return "stable";
}

// Anti-gaming signal: solving a twin problem in under this many seconds is a
// strong sign the "solve without AI" step was itself outsourced (e.g. to a
// second AI tab). Not a hard block — just a transparent flag on the receipt.
export const SUSPICIOUSLY_FAST_MS = 10000;

export function isSuspiciouslyFast(elapsedMs) {
  return elapsedMs < SUSPICIOUSLY_FAST_MS;
}

// Word-level diff for the explanation transparency view. Marks each student
// word as "echoed" (appears in the AI's answer — likely copied) or "own"
// (genuinely the student's own phrasing).
export function diffExplanation(aiAnswer, studentExplanation) {
  const cleanWord = (w) => w.toLowerCase().replace(/[^a-z0-9']/g, "");
  const aiWords = new Set(aiAnswer.split(/\s+/).map(cleanWord).filter((w) => w.length > 2));
  return studentExplanation.split(/\s+/).map((raw) => ({
    text: raw,
    echoed: aiWords.has(cleanWord(raw)),
  }));
}

// Aggregates a student's session history into four 0-100 axes for the
// Cognitive Fingerprint radar — a multi-dimensional read on how someone
// learns, not just a single score.
export function computeFingerprint(sessions) {
  const withBreakdown = sessions.filter((s) => s.explanationScore !== undefined);
  if (withBreakdown.length === 0) return null;

  const avg = (fn) => Math.round(withBreakdown.reduce((sum, s) => sum + fn(s), 0) / withBreakdown.length);

  return {
    explanation: avg((s) => (s.explanationScore || 0) * 100),
    followUp: avg((s) => (s.followUpPassed ? 100 : 0)),
    twinSolve: avg((s) => (s.twinCorrect ? 100 : 0)),
    calibration: avg((s) => {
      const predicted = (s.confidence || 50) / 100;
      const actual = s.twinCorrect ? 1 : 0;
      return (1 - Math.abs(predicted - actual)) * 100;
    }),
    sampleSize: withBreakdown.length,
  };
}