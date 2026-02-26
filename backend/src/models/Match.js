const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  homeTeam: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  awayTeam: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  homeOdds: Number,
  drawOdds: Number,
  awayOdds: Number,
  matchweek: Number,
  status: {
    type: String,
    enum: ["upcoming", "live", "finished"],
    default: "upcoming"
  },
  homeScore: { type: Number, default: 0 },
  awayScore: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Match", matchSchema);
