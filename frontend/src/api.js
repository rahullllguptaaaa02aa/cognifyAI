// Talks to our backend, which talks to Grok server-side (key never touches the browser).
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

async function post(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

async function get(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const api = {
  getTopics: () => get("/ai/topics"),
  getQuestion: (topicId) => post("/ai/question", { topicId }),
  scoreExplanation: (question, aiAnswer, studentExplanation) => post("/ai/score-explanation", { question, aiAnswer, studentExplanation }),
  getFollowUp: (question, aiAnswer, studentExplanation) => post("/ai/followup", { question, aiAnswer, studentExplanation }),
  getTwinProblem: (question, topic) => post("/ai/twin-problem", { question, topic }),
  checkTwinAnswer: (twinQuestion, expectedAnswer, keyPoints, studentAnswer) => post("/ai/check-twin-answer", { twinQuestion, expectedAnswer, keyPoints, studentAnswer }),
};
