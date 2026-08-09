require("dotenv").config();

const express = require("express");
const cors = require("cors");

const checkpointRoutes = require("./routes/checkpoint");
const engagementRoutes = require("./routes/engagement");
const aiRoutes = require("./routes/ai");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "CognifyAI backend running",
    groqConfigured: !!process.env.GROQ_API_KEY
  });
});

// API routes
app.use("/api/checkpoint", checkpointRoutes);
app.use("/api/engagement", engagementRoutes);
app.use("/api/ai", aiRoutes);

// Direct topics endpoint
// This ensures the deployed backend can always provide the topic list.
app.get("/api/ai/topics", (req, res) => {
  res.json({
    topics: [
      {
        id: "dsa",
        label: "Data Structures & Algorithms"
      },
      {
        id: "dbms",
        label: "DBMS"
      },
      {
        id: "oops",
        label: "Object-Oriented Programming"
      },
      {
        id: "os",
        label: "Operating Systems"
      },
      {
        id: "cn",
        label: "Computer Networks"
      },
      {
        id: "aptitude",
        label: "Aptitude"
      }
    ]
  });
});

// Render provides PORT through environment variables
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`CognifyAI backend listening on port ${PORT}`);
});