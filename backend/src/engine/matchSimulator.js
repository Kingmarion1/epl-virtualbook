const Standing = require("../models/Standing");
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
  const homeStanding = await Standing.findOne({ team: upcomingMatch.homeTeam._id });
const awayStanding = await Standing.findOne({ team: upcomingMatch.awayTeam._id });

homeStanding.played += 1;
awayStanding.played += 1;

homeStanding.goalsFor += homeGoals;
homeStanding.goalsAgainst += awayGoals;

awayStanding.goalsFor += awayGoals;
awayStanding.goalsAgainst += homeGoals;

if (homeGoals > awayGoals) {
  homeStanding.wins += 1;
  homeStanding.points += 3;
  awayStanding.losses += 1;
} else if (awayGoals > homeGoals) {
  awayStanding.wins += 1;
  awayStanding.points += 3;
  homeStanding.losses += 1;
} else {
  homeStanding.draws += 1;
  awayStanding.draws += 1;
  homeStanding.points += 1;
  awayStanding.points += 1;
}

await homeStanding.save();
await awayStanding.save();

  let result = "draw";
  if (homeGoals > awayGoals) result = "home";
  if (awayGoals > homeGoals) result = "away";

  await settleBets(upcomingMatch, result);

  console.log(
    `Simulated: ${upcomingMatch.homeTeam.name} ${homeGoals} - ${awayGoals} ${upcomingMatch.awayTeam.name}`
  );
}

module.exports = simulateMatches;
