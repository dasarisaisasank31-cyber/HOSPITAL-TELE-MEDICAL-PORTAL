import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/resend";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const role = session.user.role;
    const userId = session.user.id;

    let appointments;
    if (role === "PATIENT") {
      appointments = await prisma.appointment.findMany({
        where: { patientId: userId },
        include: { doctor: { select: { fullName: true, specialization: true } } },
        orderBy: { scheduledAt: 'desc' }
      });
    } else if (role === "DOCTOR") {
      appointments = await prisma.appointment.findMany({
        where: { doctorId: userId },
        include: { patient: { select: { fullName: true } } },
        orderBy: { scheduledAt: 'asc' }
      });
    } else {
      appointments = await prisma.appointment.findMany({
        include: { 
          patient: { select: { fullName: true } },
          doctor: { select: { fullName: true } } 
        },
        orderBy: { scheduledAt: 'desc' }
      });
    }

    return NextResponse.json(appointments);
  } catch (error: any) {
    console.error("GET Appointments Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { doctorId, scheduledAt, symptoms, amount } = await req.json();

    const appointment = await prisma.appointment.create({
      data: {
        patientId: session.user.id,
        doctorId,
        scheduledAt: new Date(scheduledAt),
        symptoms,
        status: "PENDING",
        payment: {
          create: {
            amount: parseFloat(amount),
            patientId: session.user.id,
            status: "PENDING"
          }
        }
      },
      include: {
        doctor: {
          include: {
            user: { select: { email: true, name: true } }
          }
        }
      }
    });

    // Notify Doctor
    if (appointment.doctor?.user?.email) {
      await sendEmail(
        appointment.doctor.user.email,
        "New Appointment Request - MediConnect",
        `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>New Consultation Request</h2>
          <p>Hello Dr. ${appointment.doctor.fullName},</p>
          <p>You have a new appointment request from <b>${session.user.name}</b>.</p>
          <p><b>Scheduled At:</b> ${new Date(scheduledAt).toLocaleString()}</p>
          <p><b>Symptoms:</b> ${symptoms}</p>
          <br/>
          <a href="${process.env.NEXTAUTH_URL}/dashboard/doctor" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Dashboard</a>
        </div>
        `
      );
    }

    // Notify Patient
    if (session.user.email) {
      await sendEmail(
        session.user.email,
        "Appointment Confirmation - MediConnect",
        `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Appointment Booked</h2>
          <p>Hello ${session.user.name},</p>
          <p>Your appointment with <b>Dr. ${appointment.doctor.fullName}</b> has been booked successfully.</p>
          <p><b>Scheduled At:</b> ${new Date(scheduledAt).toLocaleString()}</p>
          <p>Please ensure you are online 5 minutes before the session.</p>
          <br/>
          <a href="${process.env.NEXTAUTH_URL}/dashboard/patient" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View My Appointments</a>
        </div>
        `
      );
    }

    return NextResponse.json(appointment, { status: 201 });
  } catch (error: any) {
    console.error("POST Appointment Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
