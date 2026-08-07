import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;

export const getTwilioToken = (identity: string, room: string) => {
  if (!accountSid || !apiKey || !apiSecret) {
    console.warn("Twilio credentials missing. Returning mock token.");
    return "mock_token_" + identity;
  }

  const AccessToken = twilio.jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;

  const token = new AccessToken(accountSid, apiKey, apiSecret, { identity });
  const videoGrant = new VideoGrant({ room });
  token.addGrant(videoGrant);

  return token.toJwt();
};

export const sendSMS = async (to: string, body: string) => {
  if (!accountSid || !authToken) {
    console.warn(`Twilio SMS credentials missing. MOCK SMS to ${to}: ${body}`);
    return { sid: "mock_sms_sid" };
  }

  const client = twilio(accountSid, authToken);
  try {
    return await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
  } catch (error) {
    console.error("Twilio SMS Error:", error);
    return null;
  }
};
