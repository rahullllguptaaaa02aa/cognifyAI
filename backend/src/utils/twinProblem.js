// Server-side mirror of frontend/src/twinProblem.js — kept here so a future
// mobile client (or an anti-cheat re-check) can call the same generator
// without trusting a client-computed answer.
const TEMPLATES = [
  {
    id: "linear-eq", subject: "Algebra",
    generate: () => {
      const a = 2 + Math.floor(Math.random() * 6);
      const b = 3 + Math.floor(Math.random() * 10);
      const x = 1 + Math.floor(Math.random() * 8);
      const c = a * x + b;
      return { question: `Solve for x: ${a}x + ${b} = ${c}`, answer: x };
    },
  },
  {
    id: "percentage", subject: "Percentages",
    generate: () => {
      const base = (2 + Math.floor(Math.random() * 8)) * 50;
      const pct = [10, 15, 20, 25, 40][Math.floor(Math.random() * 5)];
      return { question: `What is ${pct}% of ${base}?`, answer: (base * pct) / 100 };
    },
  },
];

function generateTwinProblem(subjectHint = "") {
  const matching = TEMPLATES.filter((t) => subjectHint.toLowerCase().includes(t.subject.toLowerCase()));
  const pool = matching.length > 0 ? matching : TEMPLATES;
  const template = pool[Math.floor(Math.random() * pool.length)];
  return { ...template.generate(), templateId: template.id, subject: template.subject };
}

module.exports = { generateTwinProblem };
