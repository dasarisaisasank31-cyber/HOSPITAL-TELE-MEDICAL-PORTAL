import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePrescriptionPDF } from "@/lib/pdf";
import { uploadToS3 } from "@/lib/s3";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session || session.user.role !== "DOCTOR") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { consultationId, patientId, medications, instructions, diagnosis } = await req.json();

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: session.user.id }
    });
    const patientProfile = await prisma.patientProfile.findUnique({
      where: { userId: patientId }
    });

    if (!doctorProfile || !patientProfile) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 });
    }

    // Create prescription record
    const prescription = await prisma.prescription.create({
      data: {
        consultationId,
        patientId,
        doctorId: session.user.id,
        medications,
        instructions,
      }
    });

    // Generate PDF
    const pdfBuffer = await generatePrescriptionPDF({
      doctor: doctorProfile,
      patient: patientProfile,
      diagnosis,
      medications,
      instructions
    });

    // Upload to S3 (Mocked)
    const pdfUrl = await uploadToS3(pdfBuffer, `rx-${prescription.id}.pdf`, "application/pdf");

    // Update prescription with PDF URL
    const updatedPrescription = await prisma.prescription.update({
      where: { id: prescription.id },
      data: { pdfUrl }
    });

    return NextResponse.json(updatedPrescription);
  } catch (error: any) {
    console.error("Prescription API Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const role = session.user.role;
    let prescriptions;
    
    if (role === "PHARMACIST" || role === "ADMIN") {
      prescriptions = await prisma.prescription.findMany({
        orderBy: { issuedAt: "desc" }
      });
    } else {
      prescriptions = await prisma.prescription.findMany({
        where: role === "PATIENT" ? { patientId: session.user.id } : { doctorId: session.user.id },
        orderBy: { issuedAt: "desc" }
      });
    }

    return NextResponse.json(prescriptions);
  } catch (error: any) {
    console.error("GET Prescriptions Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
