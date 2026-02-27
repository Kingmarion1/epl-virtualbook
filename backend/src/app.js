const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

/*
===========================
Global Middleware
===========================
*/

// Security headers
app.use(helmet());

// Enable CORS (we will restrict later in production)
app.use(cors({
  origin: "*"
}));

// Body parser
app.use(express.json());

// Rate limiter (basic protection)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300 // limit each IP
});
app.use(limiter);

/*
===========================
Health Route (for Render)
===========================
*/

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "EPL VirtualBook Backend Running"
  });
});

app.use("/api/auth", require("./routes/authRoutes"));

/*
===========================
Placeholder Routes
(we plug real ones later)
===========================
*/

app.get("/", (req, res) => {
  res.send("EPL VirtualBook API");
});

/*
===========================
Global Error Handler
===========================
*/

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong"
  });
});

app.use("/api/standings", require("./routes/standingRoutes"));

app.use("/api/bets", require("./routes/betRoutes"));

app.use("/api/matches", require("./routes/matchRoutes"));

module.exports = app;
