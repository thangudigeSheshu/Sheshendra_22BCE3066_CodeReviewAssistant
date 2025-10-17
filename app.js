const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use your Unli.dev API key
const API_KEY = 'sk-qkeYf6E2bcG6uE34teESlxkCUSA1fUCn4BMvO3_He9HZtBYlLySj4gDYOZsTMEAf';
const BASE_URL = 'https://api.unli.dev/v1';

app.get('/', (req, res) => {
  res.render('index', { code: '', language: 'Python', review: '' });
});

app.post('/', async (req, res) => {
  const code = req.body.code;
  const language = req.body.language;

  const prompt = `
You are a code review assistant.
Review the following ${language} code for readability, bugs, best practices, optimizations, and security improvements.
Provide clear suggestions and explanations.

Code:
${code}

Review:
`;

  try {
    const response = await axios.post(
      `${BASE_URL}/chat/completions`,
      {
        model: "auto",
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const review = response.data.choices[0].message.content || 'No review generated.';
    res.render('index', { code, language, review });
  } catch (err) {
    console.error("Unli API error:", err.response?.data || err.message);
    res.render('index', { code, language, review: 'Error: Unable to generate code review.' });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
