import Razorpay from "razorpay";

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

let razorpay: any = null;

if (key_id && key_secret && key_id !== "rzp_test_mock") {
  razorpay = new Razorpay({
    key_id,
    key_secret,
  });
}

export const createRazorpayOrder = async (amount: number, currency: string = "INR") => {
  if (!razorpay) {
    console.warn("Razorpay credentials missing or mock. Returning mock order.");
    return {
      id: "order_mock_" + Math.random().toString(36).substring(7),
      amount: amount * 100,
      currency,
    };
  }

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // in paise
      currency,
      receipt: "receipt_" + Date.now(),
    });
    return order;
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    throw error;
  }
};
