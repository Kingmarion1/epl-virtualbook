const Bet = require("../models/Bet");
const Match = require("../models/Match");
const User = require("../models/User");

exports.placeBet = async (req, res) => {
  try {
    const { matchId, betType, stake } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const match = await Match.findById(matchId);

    if (!match || match.status !== "upcoming") {
      return res.status(400).json({ message: "Match not available" });
    }

    if (user.balance < stake) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    let odds;

    if (betType === "home") odds = match.homeOdds;
    if (betType === "draw") odds = match.drawOdds;
    if (betType === "away") odds = match.awayOdds;

    const potentialWin = stake * odds;

    user.balance -= stake;
    await user.save();

    const bet = await Bet.create({
      user: userId,
      match: matchId,
      betType,
      odds,
      stake,
      potentialWin
    });

    res.status(201).json(bet);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
