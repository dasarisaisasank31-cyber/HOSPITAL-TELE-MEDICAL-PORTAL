import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

let openai: OpenAI | null = null;
if (apiKey && !apiKey.startsWith("your-") && apiKey.trim().length > 10) {
  openai = new OpenAI({
    apiKey,
  });
}

interface DoctorInfo {
  id?: string;
  fullName: string;
  specialization: string;
  consultationFee?: number;
  rating?: number;
}

const SPECIALIZATION_RULES: Record<string, { spec: string; keywords: string[]; questions: string[] }> = {
  GeneralMedicine: {
    spec: "General Physician",
    keywords: ["fever", "chills", "body ache", "weakness", "fatigue", "viral", "flu", "infection", "cold", "sweats", "weight loss", "general checkup", "loss of appetite", "malaise", "temperature", "feeling sick", "unwell"],
    questions: ["How high is your body temperature, and how many days have you had fever?", "Are you experiencing body chills or sweating?"]
  },
  Cardiology: {
    spec: "Cardiologist",
    keywords: ["chest pain", "heart", "palpitation", "chest tightness", "shortness of breath", "breathlessness", "angina", "high blood pressure", "bp", "irregular heartbeat", "cardiac", "heart pain"],
    questions: ["Does the chest pain radiate to your left arm, neck, or jaw?", "Do you experience shortness of breath when resting or lying down?"]
  },
  Dermatology: {
    spec: "Dermatologist",
    keywords: ["skin", "rash", "itching", "itch", "acne", "pimples", "eczema", "psoriasis", "spot", "mole", "scalp", "hair loss", "dandruff", "burn", "skin lesion", "hives", "fungal", "allergy", "blister", "redness"],
    questions: ["How long have you noticed this skin issue?", "Is it accompanied by severe itching, pain, or spreading redness?"]
  },
  Orthopedics: {
    spec: "Orthopedic",
    keywords: ["joint pain", "knee pain", "back pain", "shoulder pain", "neck pain", "bone", "fracture", "arthritis", "muscle strain", "ligament", "sprain", "spine", "leg pain", "arm pain", "ankle", "stiffness", "gout", "joint"],
    questions: ["Did this pain start after a physical injury, fall, or sudden movement?", "Is there visible swelling, stiffness, or restriction in joint movement?"]
  },
  Gynecology: {
    spec: "Gynecologist",
    keywords: ["period", "periods", "menstrual", "pregnancy", "pregnant", "pelvic pain", "ovary", "uterus", "vaginal", "pcos", "cramps", "white discharge", "female health"],
    questions: ["Are your menstrual cycles regular?", "Are you currently pregnant or suspecting pregnancy?"]
  },
  Gastroenterology: {
    spec: "Gastroenterologist",
    keywords: ["stomach pain", "stomach ache", "acidity", "vomiting", "vomit", "diarrhea", "loose motion", "constipation", "nausea", "abdomen", "bloating", "indigestion", "heartburn", "gut", "gastric", "stomach", "food poisoning", "gas"],
    questions: ["Have you experienced fever, blood in stool, or inability to keep food down?", "How long have you had this stomach discomfort?"]
  },
  Neurology: {
    spec: "Neurologist",
    keywords: ["headache", "head pain", "migraine", "dizziness", "numbness", "tingling", "seizure", "fits", "paralysis", "vertigo", "memory loss", "fainting", "blackout", "nerve"],
    questions: ["Is the headache throbbing or concentrated on one side of your head?", "Are you experiencing sensitivity to light or sound, or vision changes?"]
  },
  ENT: {
    spec: "ENT Specialist",
    keywords: ["ear", "earache", "ear pain", "throat", "sore throat", "sinus", "sinusitis", "nasal", "sneezing", "runny nose", "blocked nose", "hearing", "tonsil", "cough", "phlegm"],
    questions: ["Do you have difficulty swallowing or persistent hoarseness?", "Is there ear pain, fluid discharge, or hearing blockage?"]
  },
  Dentistry: {
    spec: "Dentist",
    keywords: ["tooth", "toothache", "gum", "gums", "cavity", "jaw pain", "dental", "bleeding gums", "wisdom tooth", "teeth"],
    questions: ["Is the tooth sensitive to hot or cold food and drinks?", "Is there visible facial or jaw swelling?"]
  },
  Ophthalmology: {
    spec: "Ophthalmologist",
    keywords: ["eye", "eye pain", "vision", "blurry vision", "redness in eye", "conjunctivitis", "double vision", "watery eyes", "sight", "itching in eye"],
    questions: ["Is there any discharge or pain when moving your eyes?", "Has your vision suddenly deteriorated or blurred?"]
  },
  Psychiatry: {
    spec: "Psychiatrist",
    keywords: ["anxiety", "depression", "stress", "panic", "panic attack", "insomnia", "sleep disorder", "can't sleep", "mood swings", "sadness", "mental health", "fear", "trauma"],
    questions: ["How long have you been feeling overwhelmed or having sleep issues?", "Is this significantly impacting your daily routine or work?"]
  },
  Pediatrics: {
    spec: "Pediatrician",
    keywords: ["baby", "child", "infant", "toddler", "kid", "vaccination", "pediatric", "newborn"],
    questions: ["What is the exact age of the child?", "Is the child active, alert, and accepting fluids normally?"]
  }
};

const EMERGENCY_PATTERNS = [
  "chest pain radiating", "severe difficulty breathing", "sudden numbness", "facial drooping",
  "slurred speech", "loss of consciousness", "uncontrollable bleeding", "coughing blood",
  "severe allergic reaction", "anaphylaxis", "poisoning", "crushing chest pain", "suicidal"
];

function fallbackMedicalTriageEngine(
  messages: any[],
  availableSpecializations: string[] = [],
  availableDoctors: DoctorInfo[] = []
) {
  const userMessages = messages.filter(m => m.role === 'user').map(m => m.content.toLowerCase());
  const combinedUserText = userMessages.join(" ");

  // Check for emergency conditions
  const isEmergency = EMERGENCY_PATTERNS.some(pat => combinedUserText.includes(pat));

  // Score specializations by keyword match
  let bestCategory: string | null = null;
  let highestScore = 0;

  for (const [catName, rule] of Object.entries(SPECIALIZATION_RULES)) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (combinedUserText.includes(kw)) {
        score += kw.length > 4 ? 2 : 1;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestCategory = catName;
    }
  }

  const matchedRule = bestCategory ? SPECIALIZATION_RULES[bestCategory] : SPECIALIZATION_RULES.GeneralMedicine;
  let recommendedSpec = matchedRule.spec;

  // Fuzzy match against actual specializations available in DB
  if (availableSpecializations.length > 0) {
    const dbMatch = availableSpecializations.find(s => 
      s.toLowerCase().includes(recommendedSpec.toLowerCase()) || 
      recommendedSpec.toLowerCase().includes(s.toLowerCase())
    );
    if (dbMatch) {
      recommendedSpec = dbMatch;
    }
  }

  // Find matching doctors in DB for this exact specialization
  let matchingDocs = availableDoctors.filter(d => 
    d.specialization.toLowerCase().includes(recommendedSpec.toLowerCase()) ||
    recommendedSpec.toLowerCase().includes(d.specialization.toLowerCase())
  );

  // If no specific doctor found for this spec in DB, fallback to General Physician doctors
  if (matchingDocs.length === 0) {
    matchingDocs = availableDoctors.filter(d => 
      d.specialization.toLowerCase().includes("general") || 
      d.specialization.toLowerCase().includes("physician")
    );
  }

  // If still empty, present top available doctors
  if (matchingDocs.length === 0 && availableDoctors.length > 0) {
    matchingDocs = availableDoctors.slice(0, 2);
  }

  const doctorListFormatted = matchingDocs.length > 0
    ? matchingDocs.map(d => `- **${d.fullName}** — *${d.specialization}* (Consultation Fee: ₹${d.consultationFee || 500})`).join("\n")
    : "- **General Physician** available on our portal";

  let urgencyLevel = isEmergency 
    ? "⚠️ EMERGENCY (Seek immediate emergency medical care)" 
    : (highestScore >= 3 ? "⚡ URGENT (Schedule a consultation within 24 hours)" : "ℹ️ ROUTINE (Schedule a standard consultation)");

  let followUpQuestions = matchedRule?.questions
    ? `\n\n**To help narrow down your symptom analysis:**\n1. ${matchedRule.questions[0]}\n2. ${matchedRule.questions[1]}`
    : `\n\n**Follow-up question:** How long have you been experiencing these symptoms?`;

  const responseContent = `### 🏥 AI Medical Triage Assessment

Based on your symptoms:

- **Urgency Level**: ${urgencyLevel}
- **Recommended Medical Specialist**: **${recommendedSpec}**

---

### 📋 Clinical Guidance:
${isEmergency 
  ? `⚠️ **Emergency Warning**: Your symptoms indicate a severe condition. Please visit the nearest hospital emergency room immediately.` 
  : `1. **Consultation**: We recommend booking an appointment with a **${recommendedSpec}** for evaluation.\n2. **Care**: Avoid self-medication and keep track of symptom timing.`}${userMessages.length <= 2 ? followUpQuestions : ''}

---

### 👩‍⚕️ Recommended Available Doctors for ${recommendedSpec}:
${doctorListFormatted}

*Disclaimer: This AI tool provides triage guidance only. Always consult a certified doctor for medical treatment.*`;

  return {
    role: "assistant",
    content: responseContent
  };
}

export const getSymptomCheck = async (
  messages: any[],
  availableSpecializations?: string[],
  availableDoctors?: DoctorInfo[]
) => {
  // If OpenAI key is present and valid, attempt API call first
  if (openai) {
    const specializationsList = availableSpecializations?.join(", ") || "General Physician, Cardiologist, Dermatologist, Orthopedic, Gynecologist";
    const doctorsContext = availableDoctors?.map(d => `${d.fullName} - ${d.specialization}`).join(", ") || "No doctors listed";

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a medical triage assistant for MediConnect Indian hospital portal.
Analyze patient symptoms and ask 1-2 clarifying questions if necessary.
You MUST analyze the specific health issue and match it dynamically to the most appropriate doctor and specialization from this list: [${doctorsContext}].
Available specializations: [${specializationsList}].
For skin issues -> Dermatologist. For heart issues -> Cardiologist. For joint/back pain -> Orthopedic. For female health -> Gynecologist. For fever/cold -> General Physician.
Do not recommend the same default doctor for every prompt. Recommend the specific doctor matching the health issue.
Respond in clear markdown with sections for Summary, Urgency Level, Recommended Specialist, and Recommended Doctors.`,
          },
          ...messages,
        ],
      });

      if (response.choices[0]?.message?.content) {
        return response.choices[0].message;
      }
    } catch (error: any) {
      console.error("[OpenAI API Error] Chat completion request failed:", error?.message || error, error);
      console.info("[MediConnect Triage] Falling back to built-in medical triage engine.");
    }
  }

  // Built-in intelligent rule-based triage fallback engine
  return fallbackMedicalTriageEngine(messages, availableSpecializations, availableDoctors);
};


