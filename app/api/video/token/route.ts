import { NextResponse } from "next/server";
import { getTwilioToken } from "@/lib/twilio";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { roomId } = await req.json();
    if (!roomId) {
      return NextResponse.json({ message: "Missing roomId" }, { status: 400 });
    }

    const token = getTwilioToken(session.user?.email || "anonymous", roomId);

    return NextResponse.json({ token });
  } catch (error: any) {
    console.error("Video Token Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
