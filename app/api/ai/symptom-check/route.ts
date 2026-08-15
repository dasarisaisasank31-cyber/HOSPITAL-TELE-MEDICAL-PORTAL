import { NextResponse } from "next/server";
import { getSymptomCheck } from "@/lib/openai";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let messages = body.messages;

    if (!messages && body.symptoms) {
      messages = [{ role: 'user', content: body.symptoms }];
    }
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ content: "Invalid payload. Please supply symptom messages." }, { status: 400 });
    }

    // Fetch doctors
    let doctors = await prisma.doctorProfile.findMany({
      where: { isApproved: true },
      select: {
        id: true,
        fullName: true,
        specialization: true,
        consultationFee: true,
        rating: true,
      }
    });

    if (doctors.length === 0) {
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

    const specializations = Array.from(new Set(doctors.map(d => d.specialization)));
    
    const result = await getSymptomCheck(messages, specializations, doctors);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Symptom Check API Error:", error);
    return NextResponse.json(
      { content: "### 🏥 AI Medical Triage Assistant\n\nI'm having a momentary system issue. If you are experiencing urgent symptoms, please consult a General Physician or visit an emergency care facility immediately." },
      { status: 200 }
    );
  }
}

