import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password, name, role, specialization, licenseNumber, qualifications, experience, consultationFee } = await req.json();

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
            specialization: specialization || "General Physician",
            licenseNumber: licenseNumber || ("MCI-" + Math.floor(100000 + Math.random() * 900000)),
            experience: Number(experience) || 1,
            qualifications: qualifications || "MBBS",
            consultationFee: Number(consultationFee) || 500,
            isApproved: false,
          }
        } : undefined,
      },
    });

    const isDoctor = role === "DOCTOR";
    return NextResponse.json({ 
      message: isDoctor 
        ? "Doctor account created successfully. Approval is pending admin review." 
        : "User registered successfully", 
      user: { id: user.id, email: user.email, role: user.role } 
    }, { status: 201 });
  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
