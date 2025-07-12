import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://5000-ankitsahami-edu-9v1pcwyztuw.ws-us120.gitpod.io";

const Leaderboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/leaderboard`)
      .then(res => setData(res.data))
      .catch(err => console.error("Error loading leaderboard:", err));
  }, []);

  return (
    <div>
      <h2>🏆 Leaderboard</h2>
      {data.length === 0 ? (
        <p>No scores yet</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{entry.username}</td>
                <td>{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;
