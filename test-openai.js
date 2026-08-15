const { OpenAI } = require("openai");

const fs = require("fs");
const path = require("path");

function loadEnv() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      const match = content.match(/OPENAI_API_KEY=["']?([^"'\r\n]+)["']?/);
      if (match) return match[1];
    }
  }
  return null;
}

async function main() {
  console.log("Checking OpenAI API Key...");
  const apiKey = loadEnv();
  if (!apiKey) {
    console.error("No OPENAI_API_KEY found in environment or .env files.");
    return;
  }
  
  const openai = new OpenAI({ apiKey });

  try {
    console.log("Attempting to connect to OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // The model used in your code
      messages: [{ role: "user", content: "Hi" }],
    });
    console.log("Success! Response:");
    console.log(response.choices[0].message);
  } catch (error) {
    console.error("Error from OpenAI API:", error.message);
    if (error.code) console.error("Error Code:", error.code);
    if (error.status) console.error("Error Status:", error.status);
    if (error.type) console.error("Error Type:", error.type);
  }
}

main();
