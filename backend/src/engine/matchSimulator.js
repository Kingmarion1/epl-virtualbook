const Match = require("../models/Match");
const Bet = require("../models/Bet");
const User = require("../models/User");

function generateScore(homeStrength, awayStrength) {
  const homeGoals = Math.floor(Math.random() * (homeStrength / 20));
  const awayGoals = Math.floor(Math.random() * (awayStrength / 20));
  return { homeGoals, awayGoals };
}

async function settleBets(match, result) {
  const bets = await Bet.find({ match: match._id, status: "pending" });

  for (let bet of bets) {
    const user = await User.findById(bet.user);

    if (!user) continue;

    let win = false;

    if (result === "home" && bet.prediction === "home") win = true;
    if (result === "away" && bet.prediction === "away") win = true;
    if (result === "draw" && bet.prediction === "draw") win = true;

    if (win) {
      const payout = bet.amount * bet.odds;
      user.balance += payout;
      bet.status = "won";
      bet.payout = payout;
      await user.save();
    } else {
      bet.status = "lost";
    }

    await bet.save();
  }
}

async function simulateMatches() {
  const upcomingMatch = await Match.findOne({ status: "upcoming" })
    .populate("homeTeam awayTeam")
    .sort({ matchweek: 1 });

  if (!upcomingMatch) {
    console.log("No upcoming matches to simulate");
    return;
  }

  const { homeGoals, awayGoals } = generateScore(
    upcomingMatch.homeTeam.strength,
    upcomingMatch.awayTeam.strength
  );

  upcomingMatch.homeScore = homeGoals;
  upcomingMatch.awayScore = awayGoals;
  upcomingMatch.status = "finished";

  await upcomingMatch.save();

  let result = "draw";
  if (homeGoals > awayGoals) result = "home";
  if (awayGoals > homeGoals) result = "away";

  await settleBets(upcomingMatch, result);

  console.log(
    `Simulated: ${upcomingMatch.homeTeam.name} ${homeGoals} - ${awayGoals} ${upcomingMatch.awayTeam.name}`
  );
}

module.exports = simulateMatches;
