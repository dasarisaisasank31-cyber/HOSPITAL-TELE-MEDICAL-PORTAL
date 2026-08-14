import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const pendingDoctors = await prisma.doctorProfile.findMany({
      where: { isApproved: false },
      include: {
        user: {
          select: {
            email: true,
            createdAt: true,
          }
        }
      },
      orderBy: { id: 'desc' }
    });

    const approvedDoctors = await prisma.doctorProfile.findMany({
      where: { isApproved: true },
      include: {
        user: {
          select: {
            email: true,
            createdAt: true,
          }
        }
      },
      orderBy: { id: 'desc' }
    });

    return NextResponse.json({ pendingDoctors, approvedDoctors });
  } catch (error: any) {
    console.error("GET Admin Doctors Error:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const { doctorId, action } = await req.json();

    if (!doctorId || !action) {
      return NextResponse.json({ message: "doctorId and action are required" }, { status: 400 });
    }

    if (action === "approve") {
      const updatedDoctor = await prisma.doctorProfile.update({
        where: { id: doctorId },
        data: { isApproved: true }
      });
      return NextResponse.json({ message: "Doctor approved successfully", doctor: updatedDoctor });
    }

    if (action === "reject") {
      const doctor = await prisma.doctorProfile.findUnique({
        where: { id: doctorId },
        select: { userId: true }
      });

      if (doctor) {
        // Delete DoctorProfile and related User
        await prisma.user.delete({
          where: { id: doctor.userId }
        });
      }

      return NextResponse.json({ message: "Doctor registration rejected and account removed" });
    }

    return NextResponse.json({ message: "Invalid action. Use 'approve' or 'reject'" }, { status: 400 });
  } catch (error: any) {
    console.error("POST Admin Doctor Action Error:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
