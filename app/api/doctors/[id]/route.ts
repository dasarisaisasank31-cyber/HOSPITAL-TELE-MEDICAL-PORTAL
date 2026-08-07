import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const doctor = await prisma.doctorProfile.findUnique({
      where: { id: params.id },
    });

    if (!doctor) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json(doctor);
  } catch (error: any) {
    console.error("GET Doctor API Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
