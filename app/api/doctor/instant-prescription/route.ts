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

    const { patientId, medications, diagnosis, instructions } = await req.json();

    if (!patientId || !medications || !diagnosis) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: session.user.id }
    });
    const patientProfile = await prisma.patientProfile.findUnique({
      where: { userId: patientId }
    });

    if (!doctorProfile || !patientProfile) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 });
    }

    // Since Prescription schema requires a consultationId, and Consultation requires an appointmentId,
    // we need to mock a completed appointment and consultation for an "instant" prescription.

    // Using transaction to ensure everything is created together
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create a dummy "COMPLETED" appointment
      const appointment = await tx.appointment.create({
        data: {
          patientId: patientId,
          doctorId: session.user.id,
          scheduledAt: new Date(),
          duration: 15,
          status: "COMPLETED",
          notes: "Instant Prescription",
        }
      });

      // 2. Create the Consultation
      const consultation = await tx.consultation.create({
        data: {
          appointmentId: appointment.id,
          startedAt: new Date(),
          endedAt: new Date(),
          diagnosis: diagnosis,
          doctorNotes: "Instant Prescription issued."
        }
      });

      // 3. Create the Prescription
      const prescription = await tx.prescription.create({
        data: {
          consultationId: consultation.id,
          patientId: patientId,
          doctorId: session.user.id,
          medications: JSON.stringify(medications), // Assuming it comes as an object/array and needs stringification for SQLite
          instructions: instructions || "",
        }
      });

      return { prescription, consultation };
    });

    // 4. Generate PDF outside transaction as it's a slow/external process
    const pdfBuffer = await generatePrescriptionPDF({
      doctor: doctorProfile,
      patient: patientProfile,
      diagnosis,
      medications: typeof medications === 'string' ? JSON.parse(medications) : medications,
      instructions: instructions || ""
    });

    // 5. Upload to S3
    const pdfUrl = await uploadToS3(pdfBuffer, `rx-${result.prescription.id}.pdf`, "application/pdf");

    // 6. Update prescription with PDF URL
    const updatedPrescription = await prisma.prescription.update({
      where: { id: result.prescription.id },
      data: { pdfUrl }
    });

    return NextResponse.json({
        message: "Instant prescription created successfully",
        prescription: updatedPrescription
    });
  } catch (error: any) {
    console.error("Instant Prescription API Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
