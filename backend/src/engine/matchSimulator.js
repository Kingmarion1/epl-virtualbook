const Match = require("../models/Match");
const Bet = require("../models/Bet");
const User = require("../models/User");

const settleBets = async (match) => {
  const bets = await Bet.find({ match: match._id, status: "pending" });

  for (let bet of bets) {
    const user = await User.findById(bet.user);

    let won = false;

    if (match.result === "home" && bet.betType === "home") won = true;
    if (match.result === "draw" && bet.betType === "draw") won = true;
    if (match.result === "away" && bet.betType === "away") won = true;

    if (won) {
      bet.status = "won";
      user.balance += bet.potentialWin;
      await user.save();
    } else {
      bet.status = "lost";
    }

    await bet.save();
  }
};

const simulateMatches = async () => {
  try {
    const matches = await Match.find({ status: "upcoming" }).limit(2);

    for (let match of matches) {
      // Random scores
      const homeScore = Math.floor(Math.random() * 5);
      const awayScore = Math.floor(Math.random() * 5);

      match.homeScore = homeScore;
      match.awayScore = awayScore;
      match.status = "finished";

      if (homeScore > awayScore) match.result = "home";
      else if (homeScore < awayScore) match.result = "away";
      else match.result = "draw";

      await match.save();

      await settleBets(match);
    }

    console.log("Match simulation complete");
  } catch (err) {
    console.error("Simulation error:", err);
  }
};

module.exports = simulateMatches;
