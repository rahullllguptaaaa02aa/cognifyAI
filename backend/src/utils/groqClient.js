// Server-side Groq client. The API key NEVER touches the frontend — all calls
// go through our backend so the key stays secret.
// Groq has a genuinely free tier (rate-limited, no card needed) — check your
// current limits anytime at console.groq.com -> Settings -> Billing.
// Endpoint is OpenAI-compatible: https://api.groq.com/openai/v1/chat/completions
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// llama-3.3-70b-versatile is a strong, fast, free-tier-eligible model on Groq.
// Full current model list: console.groq.com -> Playground -> model dropdown.
const MODEL = "llama-3.3-70b-versatile";

async function callGroq(messages, { maxTokens = 400, temperature = 0.7, jsonMode = false } = {}) {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not set in backend/.env — see README for setup.");
  }

  const body = { model: MODEL, messages, max_tokens: maxTokens, temperature };
  if (jsonMode) body.response_format = { type: "json_object" };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000); // 12s timeout — never hang a live demo

  try {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      // Rate limit is the most likely failure on the free tier — surface it clearly.
      if (response.status === 429) throw new Error("Groq rate limit hit (free tier) — falling back.");
      throw new Error(`Groq API error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

module.exports = { callGroq };
