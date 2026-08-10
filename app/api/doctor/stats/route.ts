import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session || session.user.role !== "DOCTOR") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId }
    });

    if (!doctorProfile) {
      return NextResponse.json({
        todaysPatients: 0,
        pendingPrescriptions: 0,
        monthlyEarnings: 0,
        avgRating: 0,
        totalReviews: 0
      });
    }

    const doctorId = doctorProfile.id;

    // Get today's start and end date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's patients count (appointments scheduled for today)
    const todaysAppointmentsCount = await prisma.appointment.count({
      where: {
        doctorId,
        scheduledAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    // Get pending prescriptions (appointments that are completed but don't have a prescription yet)
    // For simplicity, let's just count pending appointments for now, or completed appointments missing consultation records
    // Assuming the flow is Appointment COMPLETED -> Consultation Created -> Prescription Created
    // Let's count consultations missing a prescription
    const pendingPrescriptionsCount = await prisma.consultation.count({
      where: {
        appointment: {
          doctorId
        },
        prescriptionId: null
      }
    });

    // Get monthly earnings
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const payments = await prisma.payment.findMany({
      where: {
        appointment: {
          doctorId
        },
        status: "COMPLETED",
        paidAt: {
          gte: startOfMonth
        }
      }
    });

    const monthlyEarnings = payments.reduce((acc, curr) => acc + curr.amount, 0);

    return NextResponse.json({
      todaysPatients: todaysAppointmentsCount,
      pendingPrescriptions: pendingPrescriptionsCount,
      monthlyEarnings: monthlyEarnings,
      avgRating: doctorProfile?.rating || 0,
      totalReviews: doctorProfile?.totalReviews || 0
    });
  } catch (error: any) {
    console.error("GET Doctor Stats Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
