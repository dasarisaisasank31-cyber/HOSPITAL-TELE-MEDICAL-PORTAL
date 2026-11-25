import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email, password, name, role, specialization, licenseNumber, qualifications, experience, consultationFee } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ message: "Missing required fields: email, password, and name are required." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json({ message: "An account with this email already exists. Please log in." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        passwordHash,
        role: role || "PATIENT",
        patientProfile: role === "PATIENT" ? {
          create: {
            fullName: name.trim(),
            dateOfBirth: new Date(), // Placeholder
            gender: "Not specified",
          }
        } : undefined,
        doctorProfile: role === "DOCTOR" ? {
          create: {
            fullName: name.trim(),
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

    let friendlyMessage = "Registration failed due to a server error.";
    if (error?.code === "P2021" || error?.message?.includes("does not exist")) {
      friendlyMessage = "Database tables are not initialized yet. Ensure 'prisma db push' has been run on your database.";
    } else if (error?.code === "P1001" || error?.message?.includes("Can't reach database") || error?.message?.includes("connect")) {
      friendlyMessage = "Cannot reach the database. Please check your DATABASE_URL environment variable on Render.";
    } else if (error?.code === "P2002") {
      friendlyMessage = "An account with this email already exists.";
    } else if (error?.message) {
      friendlyMessage = error.message;
    }

    return NextResponse.json({ 
      message: friendlyMessage, 
      error: error?.message || "Unknown error" 
    }, { status: 500 });
  }
}
