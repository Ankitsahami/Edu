import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://5000-ankitsahami-edu-9v1pcwyztuw.ws-us120.gitpod.io";

const AdminPanel = () => {
  const [password, setPassword] = useState("");
  
  // Add question states
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctOption, setCorrectOption] = useState(0);

  // For messages & question list
  const [message, setMessage] = useState("");
  const [questions, setQuestions] = useState([]);

  // Load current questions from backend
  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/debug/questions`);
      setQuestions(res.data);
    } catch (err) {
      setMessage("Error loading questions");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Handle option input changes
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Add new empty option input
  const addOption = () => {
    setOptions([...options, ""]);
  };

  // Submit new question
  const submitQuestion = () => {
    axios.post(`${API_URL}/api/add-question`, {
      password,
      question,
      options,
      correctOption: parseInt(correctOption),
    })
    .then(res => {
      setMessage("✅ Question added successfully!");
      setQuestion("");
      setOptions(["", ""]);
      setCorrectOption(0);
      fetchQuestions();  // refresh list
    })
    .catch(err => {
      setMessage(err.response?.data?.error || "Error adding question");
    });
  };

  // Delete a question
  const deleteQuestion = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/delete-question/${id}`, {
        data: { password },
      });
      setMessage("❌ Question deleted!");
      fetchQuestions(); // Refresh list
    } catch (err) {
      setMessage(err.response?.data?.error || "Error deleting question");
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "1rem" }}>
      <h2>🛠️ Admin Panel</h2>

      <input
        type="password"
        placeholder="Admin Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
      />

      <h3>Add New Question</h3>
      <textarea
        placeholder="Question"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        rows={3}
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      <div>
        {options.map((opt, i) => (
          <div key={i} style={{ marginBottom: "0.5rem" }}>
            <input
              type="text"
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={e => handleOptionChange(i, e.target.value)}
              style={{ width: "90%", padding: "0.3rem" }}
            />
          </div>
        ))}
        <button onClick={addOption} style={{ marginBottom: "1rem" }}>
          ➕ Add Option
        </button>
      </div>

      <label>
        Correct Option Index (0-based):{" "}
        <input
          type="number"
          min="0"
          max={options.length - 1}
          value={correctOption}
          onChange={e => setCorrectOption(e.target.value)}
          style={{ width: "50px", marginLeft: "0.5rem" }}
        />
      </label>

      <br /><br />

      <button onClick={submitQuestion} style={{ padding: "0.5rem 1rem" }}>
        Submit Question
      </button>

      <p style={{ color: "green", marginTop: "1rem" }}>{message}</p>

      <hr style={{ margin: "2rem 0" }} />

      <h3>📋 Current Questions</h3>
      <ul>
        {questions.map((q) => (
          <li key={q.id} style={{ marginBottom: "0.5rem" }}>
            <strong>{q.question}</strong>
            <button
              onClick={() => deleteQuestion(q.id)}
              style={{
                marginLeft: "1rem",
                background: "red",
                color: "white",
                border: "none",
                padding: "0.3rem 0.6rem",
                cursor: "pointer",
              }}
            >
              ❌ Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
