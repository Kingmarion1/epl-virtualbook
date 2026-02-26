const Bet = require("../models/Bet");
const Match = require("../models/Match");
const User = require("../models/User");

exports.placeBet = async (req, res) => {
  try {
    const { matchId, amount, prediction } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.balance < amount)
      return res.status(400).json({ message: "Insufficient balance" });

    const match = await Match.findById(matchId);
    if (!match || match.status !== "upcoming")
      return res.status(400).json({ message: "Match not available" });

    let odds;
    if (prediction === "home") odds = match.homeOdds;
    if (prediction === "draw") odds = match.drawOdds;
    if (prediction === "away") odds = match.awayOdds;

    const bet = await Bet.create({
      user: user._id,
      match: match._id,
      amount,
      prediction,
      odds
    });

    user.balance -= amount;
    await user.save();

    res.json({ message: "Bet placed successfully", bet });

  } catch (error) {
    res.status(500).json({ message: "Error placing bet" });
  }
};
