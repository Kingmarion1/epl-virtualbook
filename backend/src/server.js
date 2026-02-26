const simulateMatches = require("./engine/matchSimulator");

const generateSeason = require("./engine/seasonGenerator");

require("dotenv").config({ path: "../../.env" });

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); // wait for DB

    await generateSeason(); // 🔥 generate season AFTER DB connects

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: { origin: "*" }
    });

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);
    });

    server.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });
    
    setInterval(() => {
  simulateMatches();
}, 180000); // every 3 minutes
    
  } catch (error) {
    console.error("Startup error:", error);
  }
};

startServer();
