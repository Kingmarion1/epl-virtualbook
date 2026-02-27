const express = require("express");
const router = express.Router();
const { placeBet } = require("../controllers/betController");
const protect = require("../middleware/auth");

router.post("/", protect, placeBet);

router.get("/my-bets", protect, async (req, res) => {
  try {
    const bets = await Bet.find({ user: req.user.id })
      .populate({
        path: "match",
        populate: { path: "homeTeam awayTeam" }
      })
      .sort({ createdAt: -1 });

    res.json(bets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bets" });
  }
});

module.exports = router;
