const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

module.exports = router;

router.get("/register", (req, res) => {
  res.send("Register route working");
});
