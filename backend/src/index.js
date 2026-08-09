require("dotenv").config();

const express = require("express");
const cors = require("cors");

const checkpointRoutes = require("./routes/checkpoint");
const engagementRoutes = require("./routes/engagement");
const aiRoutes = require("./routes/ai");

const app = express();

// =========================
// Middleware
// =========================
app.use(cors());
app.use(express.json());

// =========================
// Health Check
// =========================
app.get("/", (req, res) => {
  res.json({
    status: "CognifyAI backend running",
    groqConfigured: !!process.env.GROQ_API_KEY,
    version: "RENDER-DEBUG-2"
  });
});

// =========================
// Debug Route
// =========================
app.get("/debug", (req, res) => {
  res.status(200).json({
    status: "DEBUG WORKS",
    version: "RENDER-DEBUG-2"
  });
});

// =========================
// API Routes
// =========================
app.use("/api/checkpoint", checkpointRoutes);
app.use("/api/engagement", engagementRoutes);
app.use("/api/ai", aiRoutes);

// =========================
// Catch Unknown Routes
// MUST BE LAST
// =========================
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    version: "RENDER-DEBUG-2"
  });
});

// =========================
// Start Server
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`CognifyAI backend listening on port ${PORT}`);
});