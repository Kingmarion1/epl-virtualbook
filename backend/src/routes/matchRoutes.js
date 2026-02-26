const express = require("express");
const router = express.Router();
const Match = require("../models/Match");

router.get("/", async (req, res) => {
  try {
    const matches = await Match.find()
      .populate("homeTeam awayTeam")
      .sort({ matchweek: 1 });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: "Error fetching matches" });
  }
});

module.exports = router;
