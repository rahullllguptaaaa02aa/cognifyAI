# 🧠 CognifyAI

### Prove You Understood It — Not Just That You Got the Answer.

> **CognifyAI transforms AI-assisted learning from passive answer copying into active understanding.**

Students increasingly use AI tools like ChatGPT and Claude to solve questions, often copying the generated answers without actually understanding them.

Traditional AI detectors try to answer:

> **"Did AI write this?"**

CognifyAI asks a much better question:

> **"Did the student actually understand it?"**

Instead of fighting AI usage, CognifyAI makes understanding a **requirement**.

---

## 🚀 The Problem

AI has made getting answers easier than ever.

A student can:

1. Copy a question into an AI tool.
2. Get a detailed solution.
3. Submit the answer.
4. Move on without learning anything.

The result is **cognitive offloading** — the student completes the task while gradually losing the ability to solve similar problems independently.

AI-text detectors are not a sustainable solution because they attempt to identify *how* an answer was produced.

### CognifyAI takes a different approach.

We don't care whether AI was used.

We care whether **learning happened**.

---

# 💡 Our Solution

CognifyAI adds an **Understanding Checkpoint** after every AI-assisted learning interaction.

### The learning loop

```text
          AI ASSISTANCE
                ↓
        Student gets solution
                ↓
      ┌─────────────────────┐
      │ Understanding Check │
      └─────────────────────┘
                ↓
       Explain it simply
                ↓
       Confused-Kid Follow-up
                ↓
         Fresh Twin Problem
                ↓
       Solve WITHOUT AI
                ↓
       ┌─────────────────────┐
       │ Understanding Score │
       └─────────────────────┘
                ↓
        Learning Recorded

The student cannot simply copy an answer and move on.

They must demonstrate understanding.

✨ Key Features
Feature	What It Does
🎯 AI Question Generation	Generates fresh, topic-specific questions using Groq
🧠 Understanding Checkpoint	Evaluates whether the student actually understands the AI-generated solution
👶 Confused-Kid Follow-up	Generates a contextual follow-up based on the student's explanation
🔄 Twin Problem	Creates a structurally similar but completely new problem
📊 Confidence Calibration	Compares student's confidence with actual correctness
🧾 AI Receipts	Maintains a transparent record of AI interactions and outcomes
📉 Engagement Decay Curve	Tracks engagement trends over time and identifies declining understanding
🛡️ Offline Fallback	Automatically switches to fallback logic if AI services are unavailable
🧩 How CognifyAI Works
1. Generate

The student chooses a topic.

CognifyAI generates a fresh question using Groq.

2. Understand

The student receives an AI-assisted explanation.

Instead of simply accepting the answer, CognifyAI asks the student to explain the concept in their own words.

3. Challenge

CognifyAI asks a short contextual question based on the student's explanation.

This makes it much harder to simply paste another AI-generated response.

4. Prove

The system generates a Twin Problem.

It has the same underlying concept but different values, structure, or context.

The student must solve it independently.

Original Problem
       ↓
AI-assisted Solution
       ↓
Student Explanation
       ↓
Follow-up Question
       ↓
New Twin Problem
       ↓
Independent Solution
       ↓
Understanding Score
🏗️ Architecture
CognifyAI
│
├── frontend/
│   ├── React Application
│   ├── Student Practice Flow
│   ├── Teacher Dashboard
│   ├── Engagement Engine
│   └── AI Receipts
│
├── backend/
│   ├── Node.js
│   ├── Express.js
│   ├── Groq API Integration
│   ├── Twin Problem Generator
│   ├── Hint Ladder
│   └── Scoring API
│
└── README.md
🛠️ Tech Stack
Frontend
React
JavaScript
CSS
Firebase
Backend
Node.js
Express.js
Groq API
REST APIs
Database & Authentication
Firebase Authentication
Cloud Firestore
Development
Git
GitHub
npm
