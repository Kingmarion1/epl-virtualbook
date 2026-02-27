import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Matches from "./pages/Matches";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import Standings from "./pages/Standings";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/standings" element={<Standings />} />
      </Routes>
    </div>
  );
}

export default App;
