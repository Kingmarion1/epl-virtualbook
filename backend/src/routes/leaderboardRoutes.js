const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const leaders = await User.find()
      .select("username balance")
      .sort({ balance: -1 })
      .limit(10);

    res.json(leaders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
});

module.exports = router;
