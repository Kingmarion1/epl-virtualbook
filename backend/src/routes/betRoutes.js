const express = require("express");
const router = express.Router();
const { placeBet } = require("../controllers/betController");
const protect = require("../middleware/auth");

router.post("/", protect, placeBet);

module.exports = router;
