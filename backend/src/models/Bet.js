const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  match: { type: mongoose.Schema.Types.ObjectId, ref: "Match" },
  amount: { type: Number, required: true },
  prediction: {
    type: String,
    enum: ["home", "draw", "away"],
    required: true
  },
  odds: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "won", "lost"],
    default: "pending"
  },
  payout: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Bet", betSchema);
