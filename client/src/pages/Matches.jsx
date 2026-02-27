function Matches() {
  return <h1 style={{ padding: 30 }}>Matches</h1>;
}

import { useEffect, useState } from "react";
import API from "../api/axios";

function Matches() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await API.get("/matches");
        setMatches(res.data);
      } catch (err) {
        console.error("Error fetching matches");
      }
    };

    fetchMatches();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h1>Upcoming Matches</h1>

      {matches.slice(0, 10).map(match => (
        <div
          key={match._id}
          style={{
            background: "#161b22",
            padding: 20,
            marginTop: 15,
            borderRadius: 8
          }}
        >
          <h3>
            {match.homeTeam.name} vs {match.awayTeam.name}
          </h3>

          <div style={{ display: "flex", gap: 15 }}>
            <button>Home ({match.homeOdds})</button>
            <button>Draw ({match.drawOdds})</button>
            <button>Away ({match.awayOdds})</button>
          </div>

          <p>Status: {match.status}</p>
        </div>
      ))}
    </div>
  );
}

export default Matches;
