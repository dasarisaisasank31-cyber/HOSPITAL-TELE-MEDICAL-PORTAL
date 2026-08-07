const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const TriageSession = require('../models/TriageSession');
const { auth } = require('../middleware/auth');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// @route   POST api/triage
// @desc    Get AI triage result
router.post('/', async (req, res) => {
  const { symptoms, patientId } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a medical triage assistant. Given patient symptoms, return ONLY a JSON object with: { \"possibleConditions\": string[], \"recommendedSpecialist\": string, \"urgencyLevel\": \"low\" | \"medium\" | \"high\", \"goToERImmediately\": boolean, \"advice\": string }"
        },
        {
          role: "user",
          content: symptoms
        }
      ],
      response_format: { type: "json_object" }
    });

    const aiResult = JSON.parse(response.choices[0].message.content);

    const session = new TriageSession({
      patientId,
      symptoms,
      aiResult
    });

    await session.save();
    res.json(aiResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI Triage failed' });
  }
});

module.exports = router;
