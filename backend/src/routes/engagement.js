const express = require("express");
const router = express.Router();
const admin = require("../config/firebaseAdmin");

// GET /api/engagement/class — returns rolling scores for every tracked student,
// used to power the teacher dashboard server-side (e.g. for a future mobile app).
router.get("/class", async (req, res) => {
  try {
    const db = admin.firestore();
    const snap = await db.collection("engagement").get();
    const records = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const byStudent = {};
    records.forEach((r) => {
      if (!byStudent[r.studentId]) byStudent[r.studentId] = [];
      byStudent[r.studentId].push(r);
    });

    const summary = Object.entries(byStudent).map(([studentId, recs]) => ({
      studentId,
      avgScore: Math.round(recs.reduce((s, r) => s + r.rollingScore, 0) / recs.length),
      subjects: recs.length,
    }));

    res.json({ students: summary, flagged: summary.filter((s) => s.avgScore < 50) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch engagement data. Is Firebase configured?" });
  }
});

module.exports = router;
