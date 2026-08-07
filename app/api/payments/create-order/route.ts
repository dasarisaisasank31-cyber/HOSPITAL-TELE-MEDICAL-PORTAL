import { NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { amount } = await req.json();
    if (!amount) return NextResponse.json({ message: "Amount is required" }, { status: 400 });

    const order = await createRazorpayOrder(amount);

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Razorpay Order API Error:", error);
    return NextResponse.json({ message: "Failed to create order" }, { status: 500 });
  }
}
