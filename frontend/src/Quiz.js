import React, { useState, useEffect } from "react";
import axios from "axios";
import { getContract } from "./contract"; // ✅ smart contract helper

const API_URL = "https://5000-ankitsahami-edu-9v1pcwyztuw.ws-us120.gitpod.io";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/api/questions`).then((res) => setQuestions(res.data));
    getWalletAddress();
  }, []);

  const getWalletAddress = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setUsername(accounts[0]); // Use wallet as username
    }
  };

  const handleAnswer = async (qid, selectedOption) => {
    try {
      const res = await axios.post(`${API_URL}/api/answer`, {
        username,
        questionId: qid,
        selectedOption,
      });

      const { correct, score } = res.data;
      setAnswers((prev) => ({ ...prev, [qid]: correct }));
      setMessage(correct ? "✅ Correct!" : "❌ Incorrect!");

      // ✅ If correct, update on-chain score
      if (correct) {
        const contract = getContract();
        const tx = await contract.setScore(score);
        await tx.wait();
        console.log("✅ Score updated on-chain");
      }

    } catch (err) {
      setMessage("Error submitting answer");
    }
  };

  return (
    <div>
      <h2>🧩 Quiz</h2>
      {questions.map((q) => (
        <div key={q.id} style={{ marginBottom: "1rem" }}>
          <p>
            <strong>{q.question}</strong>
          </p>
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(q.id, i)}
              disabled={answers[q.id] !== undefined}
              style={{
                marginRight: "10px",
                backgroundColor:
                  answers[q.id] !== undefined
                    ? i === q.correctOption
                      ? "green"
                      : "red"
                    : "",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      ))}
      <p>{message}</p>
    </div>
  );
};

export default Quiz;
