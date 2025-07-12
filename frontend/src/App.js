import React, { useState } from "react";
import WalletLogin from "./WalletLogin";
import Quiz from "./Quiz";
import Leaderboard from "./Leaderboard";
import AdminPanel from "./AdminPanel";
import ScoreManager from "./ScoreManager"; // 🆕 Import the score component

function App() {
  const [user, setUser] = useState(null);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🧠 Quiz DApp Prototype</h1>
      {!user ? (
        <WalletLogin onLogin={setUser} />
      ) : (
        <>
          <p>👋 Welcome, {user}</p>
          <ScoreManager /> {/* 🆕 Show current score and update option */}
          <hr style={{ margin: "2rem 0" }} />
          <Quiz />
          <hr style={{ margin: "2rem 0" }} />
          <Leaderboard />
          <hr style={{ margin: "2rem 0" }} />
          <AdminPanel />
        </>
      )}
    </div>
  );
}

export default App;
