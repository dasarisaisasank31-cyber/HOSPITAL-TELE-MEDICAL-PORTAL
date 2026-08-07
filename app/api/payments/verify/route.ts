import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !appointmentId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || "";
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      console.error("Invalid signature. Expected:", generated_signature, "Got:", razorpay_signature);
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    // Update payment and appointment status
    await prisma.payment.update({
      where: { appointmentId },
      data: { 
        status: "COMPLETED",
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        paidAt: new Date()
      }
    });

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "CONFIRMED" }
    });

    return NextResponse.json({ message: "Payment verified successfully" });
  } catch (error: any) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
