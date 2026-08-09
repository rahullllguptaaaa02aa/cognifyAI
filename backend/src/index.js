require("dotenv").config();

const express = require("express");
const cors = require("cors");

const checkpointRoutes = require("./routes/checkpoint");
const engagementRoutes = require("./routes/engagement");
const aiRoutes = require("./routes/ai");

const app = express();

// =========================
// CORS
// =========================

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

// =========================
// Body Parser
// =========================

app.use(express.json());

// =========================
// Health
// =========================

app.get("/", (req, res) => {
  res.json({
    status: "CognifyAI backend running",
    groqConfigured: !!process.env.GROQ_API_KEY,
  });
});

// =========================
// API
// =========================

app.use("/api/checkpoint", checkpointRoutes);
app.use("/api/engagement", engagementRoutes);
app.use("/api/ai", aiRoutes);

// =========================
// 404
// =========================

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// =========================
// Server
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`CognifyAI backend listening on port ${PORT}`);
});