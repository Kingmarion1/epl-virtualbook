const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Match",
    required: true
  },
  betType: {
    type: String,
    enum: ["home", "draw", "away"],
    required: true
  },
  odds: {
    type: Number,
    required: true
  },
  stake: {
    type: Number,
    required: true
  },
  potentialWin: {
    type: Number
  },
  status: {
    type: String,
    enum: ["pending", "won", "lost"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Bet", betSchema);
