const express = require("express");
const router = express.Router();
const { placeBet } = require("../controllers/betController");
const auth = require("../middleware/auth");

router.post("/", auth, placeBet);

module.exports = router;
