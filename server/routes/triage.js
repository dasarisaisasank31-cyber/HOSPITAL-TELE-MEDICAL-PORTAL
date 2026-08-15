const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const TriageSession = require('../models/TriageSession');
const { auth } = require('../middleware/auth');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function getFallbackTriage(symptomsText) {
  const text = (symptomsText || '').toLowerCase();
  
  const isEmergency = [
    "chest pain", "shortness of breath", "difficulty breathing", "numbness",
    "slurred speech", "unconscious", "uncontrollable bleeding", "anaphylaxis",
    "crushing pain", "coughing blood"
  ].some(kw => text.includes(kw));

  if (isEmergency) {
    return {
      possibleConditions: ["Acute Cardiac / Respiratory Emergency", "Severe Medical Event"],
      recommendedSpecialist: "Emergency Care Specialist",
      urgencyLevel: "high",
      goToERImmediately: true,
      advice: "Your symptoms indicate a potentially serious emergency. Please go to the nearest emergency room immediately or call emergency medical services."
    };
  }

  if (text.includes("skin") || text.includes("rash") || text.includes("itch") || text.includes("acne") || text.includes("spot") || text.includes("eczema")) {
    return {
      possibleConditions: ["Dermatitis", "Skin Allergy", "Eczema", "Fungal Infection"],
      recommendedSpecialist: "Dermatologist",
      urgencyLevel: "low",
      goToERImmediately: false,
      advice: "Avoid scratching the affected area, apply a gentle soothing lotion, and consult a Dermatologist for a clinical skin assessment."
    };
  }

  if (text.includes("joint") || text.includes("knee") || text.includes("back") || text.includes("fracture") || text.includes("sprain") || text.includes("bone")) {
    return {
      possibleConditions: ["Muscle Strain", "Arthritis", "Ligament Injury", "Joint Inflammation"],
      recommendedSpecialist: "Orthopedic",
      urgencyLevel: "medium",
      goToERImmediately: false,
      advice: "Apply cold compress to reduce swelling, avoid heavy strain, and schedule an appointment with an Orthopedic specialist."
    };
  }

  if (text.includes("stomach") || text.includes("acidity") || text.includes("vomit") || text.includes("diarrhea") || text.includes("nausea") || text.includes("gastric")) {
    return {
      possibleConditions: ["Gastroenteritis", "Acid Reflux / GERD", "Indigestion"],
      recommendedSpecialist: "Gastroenterologist",
      urgencyLevel: "medium",
      goToERImmediately: false,
      advice: "Stay well hydrated with clean fluids or ORS. Eat light meals and consult a Gastroenterologist if discomfort continues."
    };
  }

  if (text.includes("headache") || text.includes("migraine") || text.includes("dizzy") || text.includes("vertigo")) {
    return {
      possibleConditions: ["Tension Headache", "Migraine", "Stress / Eye Strain"],
      recommendedSpecialist: "Neurologist",
      urgencyLevel: "medium",
      goToERImmediately: false,
      advice: "Rest in a dimly lit, quiet room, stay hydrated, and consult a Neurologist if headaches persist or worsen."
    };
  }

  if (text.includes("period") || text.includes("cramps") || text.includes("pregnancy") || text.includes("pelvic")) {
    return {
      possibleConditions: ["Menstrual Cramps / Dysmenorrhea", "Hormonal Imbalance", "PCOS"],
      recommendedSpecialist: "Gynecologist",
      urgencyLevel: "low",
      goToERImmediately: false,
      advice: "Apply warm compress to the lower abdomen, rest, and book a consultation with a Gynecologist."
    };
  }

  return {
    possibleConditions: ["Viral Infection", "Upper Respiratory Infection", "General Malaise"],
    recommendedSpecialist: "General Physician",
    urgencyLevel: text.includes("fever") || text.includes("severe") ? "medium" : "low",
    goToERImmediately: false,
    advice: "Monitor your temperature, ensure adequate rest and fluid intake, and consult a General Physician for clinical evaluation."
  };
}

// @route   POST api/triage
// @desc    Get AI triage result
router.post('/', async (req, res) => {
  const { symptoms, patientId } = req.body;

  if (!symptoms || typeof symptoms !== 'string' || !symptoms.trim()) {
    return res.status(400).json({ error: 'Symptoms description is required.' });
  }

  let aiResult = null;
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey && apiKey.startsWith("sk-") && apiKey.trim().length > 20) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
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

      if (response.choices[0]?.message?.content) {
        aiResult = JSON.parse(response.choices[0].message.content);
      }
    } catch (err) {
      console.warn("[Express Triage] OpenAI request failed, using intelligent fallback engine:", err.message);
    }
  }

  if (!aiResult) {
    aiResult = getFallbackTriage(symptoms);
  }

  // Safely persist session if DB and patientId available
  try {
    if (patientId) {
      const session = new TriageSession({
        patientId,
        symptoms,
        aiResult
      });
      await session.save();
    }
  } catch (dbErr) {
    console.warn("[Express Triage] Could not persist triage session to DB:", dbErr.message);
  }

  return res.json(aiResult);
});

module.exports = router;
