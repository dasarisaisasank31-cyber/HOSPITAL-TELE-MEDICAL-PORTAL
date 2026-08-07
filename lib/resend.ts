import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

let resend: Resend | null = null;

if (apiKey) {
  resend = new Resend(apiKey);
}

export const sendEmail = async (to: string, subject: string, html: string) => {
  if (!resend) {
    console.warn(`Resend API key missing. MOCK EMAIL to ${to}: ${subject}`);
    return { id: "mock_email_id" };
  }

  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || "MediConnect <onboarding@resend.dev>",
      to,
      subject,
      html,
    });
    return data;
  } catch (error) {
    console.error("Resend Error:", error);
    return null;
  }
};
