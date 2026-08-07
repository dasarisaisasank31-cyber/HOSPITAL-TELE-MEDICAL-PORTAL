import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password, name, role } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: role || "PATIENT",
        patientProfile: role === "PATIENT" ? {
          create: {
            fullName: name,
            dateOfBirth: new Date(), // Placeholder
            gender: "Not specified",
          }
        } : undefined,
        doctorProfile: role === "DOCTOR" ? {
          create: {
            fullName: name,
            specialization: "General Physician", // Placeholder
            licenseNumber: "TEMP-" + Date.now(),
            experience: 0,
            qualifications: "MBBS",
            consultationFee: 500,
          }
        } : undefined,
      },
    });

    return NextResponse.json({ message: "User registered successfully", user: { id: user.id, email: user.email } }, { status: 201 });
  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
