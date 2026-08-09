const express = require("express");
const router = express.Router();
const { callGroq } = require("../utils/groqClient");
const { TOPICS } = require("../utils/topics");
const { FALLBACK_QUESTIONS } = require("../utils/fallbackContent");

router.get("/topics", (req, res) => res.json({ topics: TOPICS }));

// POST /api/ai/question  { topicId }
// Generates a fresh placement-interview-style question + a full AI answer.
router.post("/question", async (req, res) => {
  const { topicId = "dsa" } = req.body;
  const topic = TOPICS.find((t) => t.id === topicId)?.label || "General Aptitude";

  try {
    const raw = await callGroq(
      [
        { role: "system", content: "You are generating placement-interview practice questions for engineering students. Respond ONLY with valid JSON, no markdown, no extra text." },
        { role: "user", content: `Generate one realistic placement-interview question on "${topic}". Also give a clear, correct answer/explanation (3-5 sentences) as if explaining it to a student who asked for help. Respond as JSON: {"question": "...", "aiAnswer": "..."}` },
      ],
      { jsonMode: true, maxTokens: 350 }
    );
    const parsed = JSON.parse(raw);
    res.json({ ...parsed, topic, source: "live" });
  } catch (err) {
    console.warn("Groq call failed, using fallback question:", err.message);
    const fallback = FALLBACK_QUESTIONS[topicId] || FALLBACK_QUESTIONS.dsa;
    res.json({ ...fallback, topic, source: "fallback" });
  }
});

// POST /api/ai/score-explanation  { question, aiAnswer, studentExplanation }
// Real semantic scoring — does the student's explanation actually show
// understanding, or is it copy-paste/rephrasing?
router.post("/score-explanation", async (req, res) => {
  const { question, aiAnswer, studentExplanation } = req.body;
  if (!aiAnswer || !studentExplanation) return res.status(400).json({ error: "aiAnswer and studentExplanation required." });

  try {
    const raw = await callGroq(
      [
        { role: "system", content: "You evaluate whether a student's explanation demonstrates real understanding of an AI-given answer, versus shallow copying or rephrasing. Respond ONLY with valid JSON." },
        { role: "user", content: `Question: "${question}"\nAI's answer: "${aiAnswer}"\nStudent's explanation in their own words: "${studentExplanation}"\n\nScore 0.0-1.0 how well this shows genuine understanding (not just repeating words from the AI answer). Respond as JSON: {"score": 0.0, "reasoning": "one short sentence"}` },
      ],
      { jsonMode: true, maxTokens: 150, temperature: 0.3 }
    );
    const parsed = JSON.parse(raw);
    res.json({ score: Math.max(0, Math.min(1, parsed.score)), reasoning: parsed.reasoning, source: "live" });
  } catch (err) {
    console.warn("Groq call failed, using heuristic fallback:", err.message);
    const clean = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
    const aiWords = new Set(clean(aiAnswer));
    const studentWords = clean(studentExplanation);
    if (studentWords.length < 5) return res.json({ score: 0.1, source: "fallback" });
    const overlap = studentWords.filter((w) => aiWords.has(w)).length;
    const overlapRatio = overlap / studentWords.length;
    const lengthScore = Math.min(studentWords.length / 25, 1);
    const notJustCopying = overlapRatio < 0.85 ? 1 : 0.4;
    const score = Math.round(((overlapRatio * 0.5 + lengthScore * 0.5) * notJustCopying) * 100) / 100;
    res.json({ score, reasoning: "Scored via fallback heuristic (Groq unavailable).", source: "fallback" });
  }
});

// POST /api/ai/followup  { question, aiAnswer, studentExplanation }
// The "confused kid" persona generates ONE simple follow-up question.
router.post("/followup", async (req, res) => {
  const { question, aiAnswer, studentExplanation } = req.body;
  try {
    const raw = await callGroq([
      { role: "system", content: "You are a curious, slightly confused student asking a genuine one-line follow-up question to test if a peer's explanation actually makes sense. Keep it short and simple. Respond with ONLY the question, no preamble." },
      { role: "user", content: `Original question: "${question}"\nA peer explained it like this: "${studentExplanation}"\n\nAsk one short, genuine follow-up question that would only be answerable if they really understood it.` },
    ], { maxTokens: 60, temperature: 0.8 });
    res.json({ followUp: raw.trim().replace(/^"|"$/g, ""), source: "live" });
  } catch (err) {
    console.warn("Groq call failed, using template fallback:", err.message);
    const templates = [
      "Wait, but why does that work here? Can you explain in one line?",
      "If I changed one detail in this problem, would your approach still work? Why?",
      "What's the one most important step, and why does it matter?",
    ];
    res.json({ followUp: templates[Math.floor(Math.random() * templates.length)], source: "fallback" });
  }
});

// POST /api/ai/twin-problem  { question, topic }
// Generates a structurally similar but distinct problem to solve WITHOUT AI —
// works for any topic (not just numeric), unlike the old template-only version.
router.post("/twin-problem", async (req, res) => {
  const { question, topic } = req.body;
  try {
    const raw = await callGroq(
      [
        { role: "system", content: "You generate a 'twin problem' — structurally similar to a given question but with different specifics — to test if a student truly understood the concept, without AI help this time. Respond ONLY with valid JSON." },
        { role: "user", content: `Original question (topic: ${topic}): "${question}"\n\nGenerate ONE new twin problem testing the exact same concept, with different specifics/numbers/scenario. Also give the correct answer, and 2-3 keywords/phrases a correct answer MUST contain (for grading short open-ended answers). Respond as JSON: {"twinQuestion": "...", "expectedAnswer": "...", "keyPoints": ["...", "..."]}` },
      ],
      { jsonMode: true, maxTokens: 250 }
    );
    const parsed = JSON.parse(raw);
    res.json({ ...parsed, source: "live" });
  } catch (err) {
    console.warn("Groq call failed, using fallback twin problem:", err.message);
    res.json({
      twinQuestion: "Explain the core concept from the previous question in your own words, with a new example.",
      expectedAnswer: "Open-ended — graded by keyword presence.",
      keyPoints: [],
      source: "fallback",
    });
  }
});

// POST /api/ai/check-twin-answer  { twinQuestion, expectedAnswer, keyPoints, studentAnswer }
// Judges open-ended twin-problem answers, not just exact-match numeric ones.
router.post("/check-twin-answer", async (req, res) => {
  const { twinQuestion, expectedAnswer, keyPoints = [], studentAnswer } = req.body;
  try {
    const raw = await callGroq(
      [
        { role: "system", content: "You grade a student's answer to a test question. Be reasonably lenient — partial correct understanding counts. Respond ONLY with valid JSON." },
        { role: "user", content: `Question: "${twinQuestion}"\nExpected answer: "${expectedAnswer}"\nKey points to look for: ${JSON.stringify(keyPoints)}\nStudent's answer: "${studentAnswer}"\n\nIs the student's answer substantially correct? Respond as JSON: {"correct": true, "feedback": "one short sentence"}` },
      ],
      { jsonMode: true, maxTokens: 100, temperature: 0.2 }
    );
    const parsed = JSON.parse(raw);
    res.json({ correct: !!parsed.correct, feedback: parsed.feedback, source: "live" });
  } catch (err) {
    console.warn("Groq call failed, using keyword fallback:", err.message);
    const lower = studentAnswer.toLowerCase();
    const matched = keyPoints.filter((k) => lower.includes(k.toLowerCase()));
    const correct = keyPoints.length > 0 ? matched.length >= Math.ceil(keyPoints.length / 2) : studentAnswer.trim().length > 10;
    res.json({ correct, feedback: "Graded via fallback keyword match (Groq unavailable).", source: "fallback" });
  }
});

module.exports = router;
