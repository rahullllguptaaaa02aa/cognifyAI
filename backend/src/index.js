require("dotenv").config();

const express = require("express");

const checkpointRoutes = require("./routes/checkpoint");
const engagementRoutes = require("./routes/engagement");
const aiRoutes = require("./routes/ai");

const app = express();

// =====================================================
// CORS - Explicitly allow browser requests
// =====================================================
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://cognify-ai-one.vercel.app"
  );

  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );

  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Handle browser preflight request
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// =====================================================
// JSON
// =====================================================
app.use(express.json());

// =====================================================
// Health Check
// =====================================================
app.get("/", (req, res) => {
  res.json({
    status: "CognifyAI backend running",
    groqConfigured: !!process.env.GROQ_API_KEY,
    version: "CORS-FIX-3"
  });
});

// =====================================================
// API Routes
// =====================================================
app.use("/api/checkpoint", checkpointRoutes);
app.use("/api/engagement", engagementRoutes);
app.use("/api/ai", aiRoutes);

// =====================================================
// 404
// =====================================================
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl
  });
});

// =====================================================
// Start Server
// =====================================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`CognifyAI backend listening on port ${PORT}`);
});