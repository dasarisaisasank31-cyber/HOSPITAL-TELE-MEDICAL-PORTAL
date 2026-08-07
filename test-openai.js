const { OpenAI } = require("openai");

async function main() {
  console.log("Checking OpenAI API Key...");
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("No OPENAI_API_KEY found in .env.local");
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
