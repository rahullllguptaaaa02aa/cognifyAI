const express = require("express");
const router = express.Router();
const { generateTwinProblem } = require("../utils/twinProblem");

// GET /api/checkpoint/twin-problem?subject=Algebra
router.get("/twin-problem", (req, res) => {
  const twin = generateTwinProblem(req.query.subject || "");
  res.json(twin);
});

// POST /api/checkpoint/score-explanation  { aiAnswer, studentExplanation }
// Currently a heuristic (word-overlap) check — this is the exact spot to swap
// in a real LLM call for semantic similarity scoring in production:
//
//   const response = await fetch("https://api.anthropic.com/v1/messages", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       model: "claude-sonnet-4-6",
//       max_tokens: 200,
//       messages: [{
//         role: "user",
//         content: `AI answer: "${aiAnswer}"\nStudent explanation: "${studentExplanation}"\n
//           Score 0-1 how well the student's explanation demonstrates real understanding
//           (not just rephrasing). Respond with only a number.`
//       }]
//     })
//   });
router.post("/score-explanation", (req, res) => {
  const { aiAnswer, studentExplanation } = req.body;
  if (!aiAnswer || !studentExplanation) return res.status(400).json({ error: "aiAnswer and studentExplanation required." });

  const clean = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  const aiWords = new Set(clean(aiAnswer));
  const studentWords = clean(studentExplanation);
  if (studentWords.length < 5) return res.json({ score: 0.1 });

  const overlap = studentWords.filter((w) => aiWords.has(w)).length;
  const overlapRatio = overlap / studentWords.length;
  const lengthScore = Math.min(studentWords.length / 25, 1);
  const notJustCopying = overlapRatio < 0.85 ? 1 : 0.4;
  const score = Math.round(((overlapRatio * 0.5 + lengthScore * 0.5) * notJustCopying) * 100) / 100;

  res.json({ score });
});

module.exports = router;
