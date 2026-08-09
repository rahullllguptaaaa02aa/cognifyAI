# CognifyAI — Prove You Understood It

**The problem:** Students increasingly copy a question into ChatGPT/Claude/etc., paste the
answer, and submit — without engaging with the material at all ("cognitive offloading").
Bans don't work. AI-text detectors are an unwinnable arms race. Grades stay fine while real
understanding quietly collapses, and nobody notices until exam time.

**The idea:** Don't fight AI use — make it structurally require actual understanding. Every
AI-assisted answer has to survive a short gauntlet before it counts as "done": explain it
simply enough to satisfy a confused-kid follow-up, then solve a fresh twin problem *without*
AI help. This is the hardest part of the whole pitch to fake, and it's the technical core of
the product.

```
cognifyai/
├── frontend/     React app — practice flow, teacher dashboard, engagement engine
├── backend/      Node.js/Express — twin-problem generation, hint ladder, scoring API
└── README.md     (this file)
```

## 1. Prerequisites
- Node.js 18+, npm
- A free Firebase project (console.firebase.google.com)

## 2. Firebase setup

1. console.firebase.google.com → **Add project** → name it `cognifyai`.
2. **Web icon (</>)** → register app → copy the `firebaseConfig` object.
3. Paste it into `frontend/src/firebase.js` (marked `TODO`).
4. **Build → Authentication → enable "Email/Password"** (+ Anonymous for quick demo logins).
5. **Build → Firestore Database → Create database → Start in test mode.**
6. **Project settings → Service accounts → Generate new private key** → save as
   `backend/src/config/serviceAccountKey.json`.

## 3. Get a Groq API key — real AI, genuinely free tier

1. Go to https://console.groq.com and sign up / log in.
2. **API Keys** (left sidebar) → **Create API Key** → copy it.
3. This is a **real free tier** — no card required, rate-limited (requests/tokens per
   minute) rather than metered by cost. Check your exact limits anytime at
   **Settings → Billing** in the console. If you ever add a payment method there,
   you've moved to pay-as-you-go — but simply creating a key doesn't charge you anything.
4. Copy `backend/.env.example` to `backend/.env` and paste your key:
   ```
   GROQ_API_KEY=gsk_your-key-here
   ```

**No key yet, or want a free walkthrough first?** The app still runs — every AI call has
a built-in fallback (template questions, keyword-based grading) so nothing breaks. You'll
see a small "Offline fallback" tag on screen instead of "Live Groq response" when this
happens, so it's always clear which mode you're in — useful to know if a judge asks.

## 4. Run it

```bash
cd backend && npm install && npm run dev     # http://localhost:5000
cd frontend && npm install && npm start      # http://localhost:3000
```

Check `http://localhost:5000` in your browser — it should show
`{"status":"CognifyAI backend running","groqConfigured":true}`. If `groqConfigured` is
`false`, your `.env` key isn't being picked up — double check the file is named exactly
`.env` (not `.env.example`) and is in the `backend/` folder.

**About rate limits during your demo**: Groq's free tier caps requests per minute (varies
by model — check the exact number in your console). Each full checkpoint flow (question →
explanation score → follow-up → twin problem → grading) makes about 4 calls. Fine for a
live demo walked through once or twice; if you're doing many rapid back-to-back runs while
rehearsing, you might hit the limit — that's exactly when the fallback mode kicks in
automatically, so rehearsal won't break, it'll just show "Offline fallback" for a bit.

## 5. The features — now all backed by real Groq calls

| Feature | What it does | Status |
|---|---|---|
| **Question generation** | Groq generates a fresh placement-interview question + full answer, for any topic you pick | ✅ Real, live per-request |
| **Understanding Checkpoint** | Student explains the AI's answer; Groq scores whether it shows real understanding vs. copying | ✅ Real semantic scoring via Groq |
| **Confused-kid follow-up** | Groq generates a genuine one-line follow-up question based on the student's specific explanation | ✅ Real, contextual each time |
| **Twin Problem** | Groq generates a structurally similar but new problem — works for ANY topic, not just math | ✅ Real, and open-ended answers are graded by Groq too |
| **Confidence Calibration** | Tracks self-assessed confidence vs. actual correctness over time | ✅ Real, fully working (no AI needed for this one) |
| **AI Receipts** | Transparent, teacher-visible log of every AI interaction + how it was resolved | ✅ Real Firestore log |
| **Engagement Decay Curve** | Per-subject trend line of engagement score over weeks, flags decline early | ✅ Real, computed from live Firestore data |

**Every AI call has a safety-net fallback** (template questions, keyword-based grading) so
a flaky connection or rate limit never breaks your live demo — it just quietly switches to
"Offline fallback" mode, visibly tagged on screen so you always know which mode you're in.

## 5. Why these design choices, if a judge asks

- **Why a twin problem instead of just an explanation check?** Explanations can be gamed by
  asking the AI itself to "explain simply" — that's just outsourcing twice. A twin problem
  solved with no AI assistance is the one signal that's actually hard to fake.
- **Why not just detect AI-generated text?** That fight is already lost — detectors have high
  false-positive/negative rates and every new model update breaks them again. This product
  sidesteps the arms race entirely by not caring *whether* AI was used, only whether
  understanding resulted.
- **Why a trend line, not a single "AI usage %" number for teachers?** A raw usage percentage
  is a moralizing, low-signal metric — heavy AI use with strong twin-problem performance is
  fine. A *declining* engagement trend, regardless of AI usage volume, is the actual early
  warning sign worth a teacher's attention.
