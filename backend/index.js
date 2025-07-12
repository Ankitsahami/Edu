const express = require('express');
const cors = require('cors');
const { verifyMessage } = require("ethers"); // ✅ v6-compatible import

const app = express();
app.use(cors());
app.use(express.json());

const ADMIN_PASSWORD = "supersecret";
const PORT = 5000;

let questions = [
  {
    id: 1,
    question: "What is the capital of India?",
    options: ["Delhi", "Mumbai", "Chennai", "Kolkata"],
    correctOption: 0,
  },
];

let scores = {};
const nonces = {};

// 🧠 GET: Quiz questions (without correct answers)
app.get('/api/questions', (req, res) => {
  const sanitized = questions.map(({ correctOption, ...rest }) => rest);
  res.json(sanitized);
});

// ✅ POST: Submit quiz answer
app.post('/api/answer', (req, res) => {
  const { username, questionId, selectedOption } = req.body;
  const question = questions.find(q => q.id === questionId);

  if (!question) {
    return res.status(400).json({ error: 'Invalid question ID' });
  }

  if (!scores[username]) scores[username] = 0;
  if (question.correctOption === selectedOption) scores[username]++;

  res.json({ correct: question.correctOption === selectedOption, score: scores[username] });
});

// 🏆 GET: Leaderboard
app.get('/api/leaderboard', (req, res) => {
  const leaderboard = Object.entries(scores)
    .map(([username, score]) => ({ username, score }))
    .sort((a, b) => b.score - a.score);

  res.json(leaderboard);
});

// 🛠️ POST: Add a quiz question
app.post('/api/add-question', (req, res) => {
  const { password, question, options, correctOption } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  if (!question || !options || options.length < 2 || correctOption == null) {
    return res.status(400).json({ error: "Invalid data" });
  }

  const exists = questions.some(q => q.question.trim().toLowerCase() === question.trim().toLowerCase());
  if (exists) {
    return res.status(409).json({ error: "Question already exists" });
  }

  const newQuestion = {
    id: questions.length + 1,
    question,
    options,
    correctOption,
  };

  questions.push(newQuestion);
  res.json({ success: true, question: newQuestion });
});

// ❌ DELETE: Remove question by ID
app.delete('/api/delete-question/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { password } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const index = questions.findIndex(q => q.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Question not found" });
  }

  const removed = questions.splice(index, 1);
  res.json({ success: true, removed });
});

// 🔐 GET: Nonce for wallet login
app.get('/api/nonce/:address', (req, res) => {
  const address = req.params.address.toLowerCase();
  const nonce = Math.floor(Math.random() * 1000000).toString();
  nonces[address] = nonce;
  res.json({ nonce });
});

// 🔐 POST: Verify wallet signature for login
app.post('/api/login', (req, res) => {
  const { address, signature } = req.body;

  if (!address || !signature) {
    return res.status(400).json({ error: 'Missing address or signature' });
  }

  const nonce = nonces[address.toLowerCase()];
  if (!nonce) {
    return res.status(400).json({ error: 'Nonce not found, please request a new nonce' });
  }

  const msg = `Login nonce: ${nonce}`;

  try {
    const recoveredAddr = verifyMessage(msg, signature); // ✅ v6-compatible
    if (recoveredAddr.toLowerCase() === address.toLowerCase()) {
      delete nonces[address.toLowerCase()];
      return res.json({ success: true, address });
    } else {
      return res.status(401).json({ error: 'Signature verification failed' });
    }
  } catch (e) {
    return res.status(400).json({ error: 'Invalid signature' });
  }
});

// 🧪 GET: Debug — full questions
app.get('/api/debug/questions', (req, res) => {
  res.json(questions);
});

// 🟢 Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
