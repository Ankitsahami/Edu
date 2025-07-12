import React from "react";
import Quiz from "./Quiz";
import Leaderboard from "./Leaderboard";
import AdminPanel from "./AdminPanel";

function App() {
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🧠 Quiz DApp Prototype</h1>
      <Quiz />
      <hr style={{ margin: "2rem 0" }} />
      <Leaderboard />
      <hr style={{ margin: "2rem 0" }} />
      <AdminPanel />
    </div>
  );
}

export default App;
