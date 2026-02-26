const Team = require("../models/Team");
const Match = require("../models/Match");

const teamsData = [
  { name: "Arsenal", strength: 90 },
  { name: "Manchester City", strength: 93 },
  { name: "Liverpool", strength: 90 },
  { name: "Chelsea", strength: 89 },
  { name: "Manchester United", strength: 86 },
  { name: "Tottenham", strength: 83 },
  { name: "Newcastle", strength: 84 },
  { name: "Brighton", strength: 80 },
  { name: "West Ham", strength: 75 },
  { name: "Aston Villa", strength: 81 },
  { name: "Everton", strength: 77 },
  { name: "Wolves", strength: 75 },
  { name: "Crystal Palace", strength: 77 },
  { name: "Brentford", strength: 79 },
  { name: "Fulham", strength: 78 },
  { name: "Bournemouth", strength: 78 },
  { name: "Burnley", strength: 74 },
  { name: "Leed United", strength: 70 },
  { name: "Sunderland", strength: 73 },
  { name: "Nottingham Forest", strength: 76 }
];

function calculateOdds(homeStrength, awayStrength) {
  const total = homeStrength + awayStrength;

  const homeProb = homeStrength / total;
  const awayProb = awayStrength / total;
  const drawProb = 0.2;

  return {
    homeOdds: (1 / homeProb).toFixed(2),
    drawOdds: (1 / drawProb).toFixed(2),
    awayOdds: (1 / awayProb).toFixed(2)
  };
}

async function generateSeason() {
  const existingMatches = await Match.countDocuments();
  if (existingMatches > 0) {
    console.log("Season already exists");
    return;
  }

  await Team.deleteMany();
  await Match.deleteMany();

  const createdTeams = await Team.insertMany(teamsData);

  let matchweek = 1;

  for (let i = 0; i < createdTeams.length; i++) {
    for (let j = i + 1; j < createdTeams.length; j++) {

      const homeTeam = createdTeams[i];
      const awayTeam = createdTeams[j];

      const odds1 = calculateOdds(homeTeam.strength, awayTeam.strength);
      const odds2 = calculateOdds(awayTeam.strength, homeTeam.strength);

      await Match.create({
        homeTeam: homeTeam._id,
        awayTeam: awayTeam._id,
        ...odds1,
        matchweek
      });

      await Match.create({
        homeTeam: awayTeam._id,
        awayTeam: homeTeam._id,
        ...odds2,
        matchweek
      });

      matchweek++;
    }
  }

  console.log("Full EPL season generated");
}

module.exports = generateSeason;
