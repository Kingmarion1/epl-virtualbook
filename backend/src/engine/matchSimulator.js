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
