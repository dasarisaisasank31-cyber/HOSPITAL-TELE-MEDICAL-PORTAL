import { NextResponse } from "next/server";
import { getSymptomCheck, FALLBACK_DOCTORS_CATALOG } from "@/lib/openai";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let messages: any[] = [];
  try {
    const body = await req.json();
    messages = body.messages;

    if (!messages && body.symptoms) {
      messages = [{ role: 'user', content: body.symptoms }];
    }
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      messages = [{ role: 'user', content: "General health checkup" }];
    }

    // Safely fetch doctors from database, falling back to catalog if DB is unreachable
    let doctors: any[] = [];
    try {
      doctors = await prisma.doctorProfile.findMany({
        where: { isApproved: true },
        select: {
          id: true,
          fullName: true,
          specialization: true,
          consultationFee: true,
          rating: true,
        }
      });

      if (!doctors || doctors.length === 0) {
        doctors = await prisma.doctorProfile.findMany({
          select: {
            id: true,
            fullName: true,
            specialization: true,
            consultationFee: true,
            rating: true,
          }
        });
      }
    } catch (dbError) {
      console.warn("DB doctor fetch skipped in symptom-check, using fallback doctors:", dbError);
    }

    if (!doctors || doctors.length === 0) {
      doctors = FALLBACK_DOCTORS_CATALOG;
    }

    const specializations = Array.from(new Set(doctors.map((d: any) => d.specialization)));
    
    const result = await getSymptomCheck(messages, specializations, doctors);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Symptom Check API Error:", error);
    try {
      const fallbackResult = await getSymptomCheck(messages, [], FALLBACK_DOCTORS_CATALOG);
      return NextResponse.json(fallbackResult);
    } catch (fallbackError) {
      return NextResponse.json({
        role: "assistant",
        content: `### 🏥 AI Medical Triage Assessment\n\n- **Urgency Level**: ⚡ ROUTINE (Schedule a consultation within 24-48 hours)\n- **Recommended Medical Specialist**: **General Physician**\n\n### 📋 Clinical Guidance:\n1. Keep track of symptom progression and timing.\n2. Stay hydrated and avoid strenuous activities.\n\n### 👩‍⚕️ Recommended Available Doctors:\n- **Dr. Rajesh Kumar** — *General Physician* (Consultation Fee: ₹400)\n- **Dr. Priya Sharma** — *Cardiologist* (Consultation Fee: ₹800)\n- **Dr. Anitha Reddy** — *Dermatologist* (Consultation Fee: ₹600)`
      });
    }
  }
}

