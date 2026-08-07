import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "DOCTOR") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (query.length < 3) {
      return NextResponse.json([]);
    }

    // Search by PatientProfile fullName OR User email
    const patients = await prisma.patientProfile.findMany({
      where: {
        OR: [
          {
            fullName: {
              contains: query
            }
          },
          {
            user: {
              email: {
                contains: query
              }
            }
          }
        ]
      },
      include: {
        user: {
          select: {
            email: true,
            phone: true
          }
        }
      },
      take: 10
    });

    const formattedPatients = patients.map((p) => ({
      id: p.userId, // Using userId as it is used for prescriptions
      fullName: p.fullName,
      email: p.user?.email,
      phone: p.user?.phone,
      avatar: p.avatar,
      dateOfBirth: p.dateOfBirth,
      gender: p.gender
    }));

    return NextResponse.json(formattedPatients);
  } catch (error: any) {
    console.error("Patient Search API Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
