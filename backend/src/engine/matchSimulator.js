const Match = require("../models/Match");
const Team = require("../models/Team");
const generateSeason = require("./seasonGenerator");
const {
  getCurrentWeek,
  incrementWeek,
  resetWeek
} = require("./seasonState");

const simulateMatches = async () => {
  try {
    const week = getCurrentWeek();

    if (week > 38) {
      console.log("Season finished. Starting new season...");
      await Match.deleteMany({});
      await generateSeason();
      resetWeek();
      return;
    }

    const matches = await Match.find({
      matchweek: week,
      status: "upcoming"
    });

    for (let match of matches) {
      const homeTeam = await Team.findById(match.homeTeam);
      const awayTeam = await Team.findById(match.awayTeam);

      const diff = homeTeam.strength - awayTeam.strength;

      // Probability logic
      let homeWinProb = 0.45 + diff / 200;
      let drawProb = 0.25;
      let awayWinProb = 1 - homeWinProb - drawProb;

      // Clamp values (avoid negatives)
      homeWinProb = Math.max(0.15, Math.min(0.75, homeWinProb));
      awayWinProb = Math.max(0.15, Math.min(0.75, awayWinProb));

      const rand = Math.random();

      let homeScore = 0;
      let awayScore = 0;

      if (rand < homeWinProb) {
        homeScore = 1 + Math.floor(Math.random() * 3);
        awayScore = Math.floor(Math.random() * 2);
      } else if (rand < homeWinProb + drawProb) {
        const goals = Math.floor(Math.random() * 3);
        homeScore = goals;
        awayScore = goals;
      } else {
        homeScore = Math.floor(Math.random() * 2);
        awayScore = 1 + Math.floor(Math.random() * 3);
      }

      match.homeScore = homeScore;
      match.awayScore = awayScore;
      match.status = "finished";

      await match.save();
    }

    console.log(`Week ${week} simulated ✅`);
    incrementWeek();

  } catch (error) {
    console.error("Simulation error:", error);
  }
};

module.exports = simulateMatches;
