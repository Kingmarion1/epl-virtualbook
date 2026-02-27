const express = require("express");
const router = express.Router();
const Standing = require("../models/Standing");

router.get("/", async (req, res) => {
  try {
    const table = await Standing.find()
      .populate("team")
      .sort({ points: -1, goalsFor: -1 });

    res.json(table);
  } catch (error) {
    res.status(500).json({ message: "Error fetching standings" });
  }
});

module.exports = router;
