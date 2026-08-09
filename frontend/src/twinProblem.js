// Generates a structurally identical problem with different numbers — the
// hardest-to-fake signal in the whole product. Template-based for numeric
// subjects; swap in an LLM for open-ended subjects in production (see README).

const TEMPLATES = [
  {
    id: "linear-eq",
    subject: "Algebra",
    generate: () => {
      const a = 2 + Math.floor(Math.random() * 6);
      const b = 3 + Math.floor(Math.random() * 10);
      const x = 1 + Math.floor(Math.random() * 8);
      const c = a * x + b;
      return { question: `Solve for x: ${a}x + ${b} = ${c}`, answer: x };
    },
  },
  {
    id: "fraction-add",
    subject: "Fractions",
    generate: () => {
      const denominators = [4, 6, 8, 10, 12];
      const d = denominators[Math.floor(Math.random() * denominators.length)];
      const n1 = 1 + Math.floor(Math.random() * (d / 2));
      const n2 = 1 + Math.floor(Math.random() * (d / 2));
      const sum = n1 + n2;
      return { question: `Simplify: ${n1}/${d} + ${n2}/${d}`, answer: `${sum}/${d}`, acceptAlt: simplifyFraction(sum, d) };
    },
  },
  {
    id: "percentage",
    subject: "Percentages",
    generate: () => {
      const base = (2 + Math.floor(Math.random() * 8)) * 50;
      const pct = [10, 15, 20, 25, 40][Math.floor(Math.random() * 5)];
      const answer = (base * pct) / 100;
      return { question: `What is ${pct}% of ${base}?`, answer };
    },
  },
];

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
function simplifyFraction(n, d) {
  const g = gcd(n, d);
  return `${n / g}/${d / g}`;
}

// Picks a template matching the subject of the original question if possible,
// otherwise a random one — keeps the twin problem topically relevant.
export function generateTwinProblem(subjectHint = "") {
  const matching = TEMPLATES.filter((t) => subjectHint.toLowerCase().includes(t.subject.toLowerCase()));
  const pool = matching.length > 0 ? matching : TEMPLATES;
  const template = pool[Math.floor(Math.random() * pool.length)];
  return { ...template.generate(), templateId: template.id, subject: template.subject };
}

export function checkTwinAnswer(twin, submitted) {
  const norm = (v) => String(v).trim().toLowerCase();
  if (norm(submitted) === norm(twin.answer)) return true;
  if (twin.acceptAlt && norm(submitted) === norm(twin.acceptAlt)) return true;
  return false;
}
