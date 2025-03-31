import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = "subashchandraboseravi45@gmail.com"; // Must be verified in Brevo

export default async function sendOtp(email: string, otp: number, endpoint: string) {
    const emailHtml = `
    <div style="font-family: 'Arial', sans-serif; background-color: #0d0d0d; padding: 40px; text-align: center; color: #fff;">
        <div style="background: #facc15; padding: 15px; border-radius: 8px;">
            <img src="https://www.casinobharat.space/assets/colorbet.png" alt="Casino Bharat" style="width: 180px; margin-bottom: 10px;" />
        </div>
        <div style="background: #1a1a1a; padding: 30px; border-radius: 12px; margin-top: 20px; box-shadow: 0 0 15px rgba(250, 204, 21, 0.3);">
            <h2 style="color: #facc15; font-size: 24px; margin-bottom: 15px;">Your One-Time Password (OTP)</h2>
            <p style="font-size: 18px; color: #e0e0e0;">Use this code to complete your verification on <strong>${endpoint}</strong>.</p>
            <div style="font-size: 28px; font-weight: bold; background: #facc15; color: #111; padding: 15px 30px; display: inline-block; border-radius: 10px; letter-spacing: 2px; margin-top: 15px;">
                ${otp}
            </div>
            <p style="margin-top: 20px; font-size: 14px; color: #bbb;">This OTP is valid for one minute. Never share this code with anyone.</p>
        </div>
        <p style="font-size: 12px; color: #777; margin-top: 25px;">
            If you did not request this, please ignore this email or contact our <a href="https://www.casinospace.space/" style="color: #facc15; text-decoration: none;">Support Team</a>.
        </p>
    </div>`;

    try {
        const response = await axios.post("https://api.brevo.com/v3/smtp/email", {
            sender: { email: BREVO_SENDER_EMAIL, name: "Casino Bharat" },
            to: [{ email: email, name: "Casino Bharat User" }],
            subject: `Your Secure OTP for ${endpoint}`,
            htmlContent: emailHtml,
        }, {
            headers: {
                "Content-Type": "application/json",
                "api-key": BREVO_API_KEY,
            },
        });

        console.log("✅ Email sent successfully via Brevo:", response.data);
    } catch (error: any) {
        console.error("❌ Error while sending email with Brevo:", error.response?.data || error.message);
    }
}
