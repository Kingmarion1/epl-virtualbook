const Team = require("../models/Team");
const Match = require("../models/Match");

const generateSeason = async () => {
  try {
    const existingMatches = await Match.countDocuments();
    if (existingMatches > 0) {
      console.log("Season already exists");
      return;
    }

    // ----- Ensure teams exist -----
    const existingTeams = await Team.find();
    let teams = existingTeams;

    if (teams.length !== 20) {
      console.log("Inserting 20 default teams...");

      const defaultTeams = [
        { name: "Arsenal", strength: 91 },
        { name: "Chelsea", strength: 89 },
        { name: "Liverpool", strength: 90 },
        { name: "Manchester City", strength: 92 },
        { name: "Manchester United", strength: 88 },
        { name: "Tottenham", strength: 84 },
        { name: "burnly", strength: 76 },
        { name: "Everton", strength: 79 },
        { name: "Wolves", strength: 76 },
        { name: "West Ham", strength: 76 },
        { name: "Aston Villa", strength: 86 },
        { name: "Sunderland", strength: 74 },
        { name: "Brighton", strength: 78 },
        { name: "Newcastle", strength: 85 },
        { name: "Crystal Palace", strength: 77 },
        { name: "Brentford", strength: 78 },
        { name: "Leeds", strength: 73 },
        { name: "Bournemouth", strength: 78 },
        { name: "Fulham", strength: 77 },
        { name: "Nottingham Forest", strength: 74 }
      ];

      teams = await Team.insertMany(defaultTeams);
    }

    const teamIds = teams.map(t => t._id);

    // ----- Round Robin Logic -----
    const totalWeeks = 38;
    const matchesPerWeek = 10;
    let rotating = [...teamIds];
    const fixed = rotating.shift(); // keep first team fixed

    for (let week = 1; week <= totalWeeks; week++) {
      const weekMatches = [];
      const current = [fixed, ...rotating];

      for (let i = 0; i < matchesPerWeek; i++) {
        const home = current[i];
        const away = current[current.length - 1 - i];

        const isSecondHalf = week > 19;

        weekMatches.push({
          homeTeam: isSecondHalf ? away : home,
          awayTeam: isSecondHalf ? home : away,
          homeOdds: (1.5 + Math.random() * 2).toFixed(2),
          drawOdds: (2.5 + Math.random() * 2).toFixed(2),
          awayOdds: (1.5 + Math.random() * 2).toFixed(2),
          matchweek: week,
          status: "upcoming"
        });
      }

      await Match.insertMany(weekMatches);

      // Rotate teams except fixed
      rotating.unshift(rotating.pop());
    }

    console.log("Full 38-week season generated ✅");

  } catch (err) {
    console.error("Season generation error:", err);
  }
};

module.exports = generateSeason;
