import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const id = params.id;

    // Fetch appointment by ID or meetingRoomId
    const appointment = await prisma.appointment.findFirst({
      where: {
        OR: [
          { id: id },
          { meetingRoomId: id }
        ]
      },
      include: {
        patient: {
          include: {
            patientProfile: true
          }
        },
        doctor: {
          include: {
            user: true
          }
        }
      }
    });

    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found" }, { status: 404 });
    }

    // Ensure the user is either the doctor or patient of this appointment
    if (session.user.role === "PATIENT" && appointment.patientId !== session.user.id) {
       return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    if (session.user.role === "DOCTOR" && appointment.doctorId !== session.user.id) {
       return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(appointment);
  } catch (error: any) {
    console.error("GET Appointment Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
