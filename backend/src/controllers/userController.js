const User = require("../models/User");
const Bet = require("../models/Bet");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const bets = await Bet.find({ user: user._id });

    const totalBets = bets.length;
    const wins = bets.filter(b => b.status === "won").length;
    const losses = bets.filter(b => b.status === "lost").length;

    const totalProfit = bets.reduce((acc, bet) => {
      if (bet.status === "won") return acc + (bet.payout - bet.amount);
      if (bet.status === "lost") return acc - bet.amount;
      return acc;
    }, 0);

    res.json({
      user,
      stats: {
        totalBets,
        wins,
        losses,
        totalProfit
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};
