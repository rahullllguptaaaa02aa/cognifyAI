require("dotenv").config();

const express = require("express");

const checkpointRoutes = require("./routes/checkpoint");
const engagementRoutes = require("./routes/engagement");
const aiRoutes = require("./routes/ai");

const app = express();

// ==============================
// CORS
// ==============================

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://cognify-ai-one.vercel.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

app.use(express.json());

// ==============================
// HEALTH
// ==============================

app.get("/", (req, res) => {
  res.json({
    status: "CognifyAI backend running",
    version: "FINAL-FIX-1",
    groqConfigured: !!process.env.GROQ_API_KEY
  });
});

// ==============================
// DIRECT TOPICS TEST
// ==============================

app.get("/api/ai/topics", (req, res) => {
  res.json({
    topics: [
      { id: "dsa", label: "Data Structures & Algorithms" },
      { id: "oops", label: "OOP Concepts" },
      { id: "dbms", label: "DBMS" },
      { id: "os", label: "Operating Systems" },
      { id: "cn", label: "Computer Networks" },
      { id: "aptitude", label: "Quantitative Aptitude" },
      { id: "hr", label: "HR / Behavioral" },
      { id: "system-design", label: "System Design Basics" }
    ]
  });
});

// ==============================
// NORMAL API ROUTES
// ==============================

app.use("/api/checkpoint", checkpointRoutes);
app.use("/api/engagement", engagementRoutes);
app.use("/api/ai", aiRoutes);

// ==============================
// 404
// ==============================

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    version: "FINAL-FIX-1"
  });
});

// ==============================
// SERVER
// ==============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`CognifyAI backend listening on port ${PORT}`);
});