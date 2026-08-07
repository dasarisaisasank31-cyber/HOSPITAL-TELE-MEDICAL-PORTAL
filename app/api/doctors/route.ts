import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const spec = searchParams.get("specialization");
    
    let doctors = await prisma.doctorProfile.findMany({
      where: {
        isApproved: true,
        specialization: spec ? { contains: spec } : undefined,
      },
      include: {
        user: {
          select: {
            email: true,
          }
        }
      }
    });

    if (doctors.length === 0 && !spec) {
      doctors = await prisma.doctorProfile.findMany({
        include: {
          user: {
            select: {
              email: true,
            }
          }
        }
      });
    }

    return NextResponse.json(doctors);
  } catch (error: any) {
    console.error("API Doctors Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

