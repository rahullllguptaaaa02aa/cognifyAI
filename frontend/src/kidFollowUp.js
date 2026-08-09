// The "explain it to a confused kid" persona. Asks one simple follow-up based
// on the student's explanation — if they can't answer it, they didn't really
// internalize the concept, they just rephrased it.
// Template-based here; production version swaps in a real LLM persona call.

const FOLLOW_UP_TEMPLATES = [
  (topic) => `Wait, but why does that work for ${topic}? Can you explain in one line?`,
  (topic) => `If I changed one number in this ${topic} problem, would your method still work? Why?`,
  (topic) => `What would happen if I got this step wrong — what mistake would that look like?`,
  (topic) => `Can you show me the one most important step, and why it's the important one?`,
];

export function generateFollowUp(subject) {
  const template = FOLLOW_UP_TEMPLATES[Math.floor(Math.random() * FOLLOW_UP_TEMPLATES.length)];
  return template(subject || "this");
}

// Heuristic pass check: a real answer to a follow-up should be a genuine
// sentence (not a one-word dodge) and shouldn't just be a copy of the original
// explanation verbatim.
export function checkFollowUpAnswer(originalExplanation, followUpAnswer) {
  const words = followUpAnswer.trim().split(/\s+/).filter(Boolean);
  if (words.length < 4) return false;
  const isVerbatim = followUpAnswer.trim().toLowerCase() === originalExplanation.trim().toLowerCase();
  return !isVerbatim;
}
