require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const port = 5000;

// ✅ FIXED: Preflight-safe CORS config
app.use(cors());

// ✅ Handle JSON body
app.use(express.json());

// ✅ Optional debug route to test CORS
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// ✅ OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Main AI route
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    console.log('📥 Received message:', message);

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: message }],
    });

    const reply = response.choices[0]?.message?.content || "⚠️ No reply";
    res.json({ reply });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/ping', (req, res) => {
    console.log("🛎️  /api/ping hit!");
    res.status(200).json({ message: 'pong' });
  });

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});