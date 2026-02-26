const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  strength: { type: Number, required: true } // Used for odds logic
});

module.exports = mongoose.model("Team", teamSchema);
