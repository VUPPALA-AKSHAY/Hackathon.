const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public")); // Serve static files

const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";  // Update this URL with the correct endpoint

app.get("/", (req, res) => {
  res.send("Welcome to the Llama Debugging API powered by Groq!");
});
app.post("/debug", async (req, res) => {
  const { code, language } = req.body;
  try {
    // Prepare request to Groq API
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",  // Ensure this model is supported
        messages: [
          { role: "system", content: `  "Explain the errors in the code and  (IF the code is correctdisplay the output) and You are a professional debugging assistant specialized in ${language}.` },
          { role: "user", content: `Debug this code:\n\n${code}` }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error with Groq API:", error);
      return res.status(500).json({ error: error.message });
    }

    const data = await response.json();
    const result = data.choices[0].message.content; // Adjust this based on the actual Groq API response format
    res.json({ result });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = 8002;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


// node server.js

  
 