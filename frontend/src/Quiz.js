import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://5000-ankitsahami-edu-9v1pcwyztuw.ws-us120.gitpod.io";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [username, setUsername] = useState("anon");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/api/questions`)
      .then(res => setQuestions(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAnswer = (selected) => {
    const question = questions[currentQ];

    axios.post(`${API_URL}/api/answer`, {
      username,
      questionId: question.id,
      selectedOption: selected
    }).then(res => {
      if (res.data.correct) {
        alert("✅ Correct!");
      } else {
        alert("❌ Incorrect!");
      }
      setScore(res.data.score);
      if (currentQ + 1 < questions.length) {
        setCurrentQ(currentQ + 1);
      } else {
        setSubmitted(true);
      }
    });
  };

  if (!questions.length) return <p>Loading questions...</p>;
  if (submitted) return <h2>Quiz completed! Your score: {score}</h2>;

  const q = questions[currentQ];

  return (
    <div>
      <h2>Welcome, {username}</h2>
      <h3>Question {currentQ + 1}: {q.question}</h3>
      <ul>
        {q.options.map((opt, idx) => (
          <li key={idx}>
            <button onClick={() => handleAnswer(idx)}>{opt}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Quiz;
