"use server";

import { prisma } from "@/lib/prisma";
import { getBaseEmailTemplate, getTransporter } from "@/lib/email";
import { v4 as uuidv4 } from "uuid";

export async function sendPasswordResetEmail(formData: FormData) {
  const email = formData.get("email");
  if (typeof email !== "string" || !email) throw new Error("Email is required");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Return silently to prevent email enumeration
    return { success: true };
  }

  const requestCount = await prisma.passwordResetToken.count({
    where: { email }
  });

  if (requestCount >= 5) {
    return { success: false, error: "You have already tried more than five times. Please contact admin to reset your password" };
  }


  const token = uuidv4();
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;

  const content = `
    <p style="color: rgba(245, 239, 230, 0.9); font-size: 16px; line-height: 1.6;">Hello <span style="color: #C5A059; font-weight: bold;">${user.username || user.name || 'Predictor'}</span>,</p>
    <p style="color: rgba(245, 239, 230, 0.9); font-size: 16px; line-height: 1.6;">We received a request to reset your password for your FIFA WC 2026 Predictor account. Click the button below to securely set a new password.</p>
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(to right, #C5A059, #E8D5A3); color: #2C2C2C; font-weight: bold; font-size: 16px; text-decoration: none; padding: 15px 30px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 25px -5px rgba(197, 160, 89, 0.4);">Set New Password</a>
    </div>
    
    <p style="color: rgba(245, 239, 230, 0.6); font-size: 14px; line-height: 1.6; border-top: 1px dashed rgba(197, 160, 89, 0.3); padding-top: 20px;">If you didn't request this, you can safely ignore this email. This link will expire in 1 hour.</p>
  `;
  
  const html = getBaseEmailTemplate("Password Reset Request", content);
  const transporter = getTransporter();

  // Send email asynchronously in the background
  transporter.sendMail({
    from: process.env.SMTP_FROM || '"FIFA WC 2026 Predictor" <noreply@wcpredictor.com>',
    to: email,
    subject: "Reset your FIFA WC 2026 Predictor Password",
    html,
  }).catch((error: any) => {
    console.error("SMTP Error:", error.message);
    console.log("-----------------------------------------");
    console.log("DEV MODE RESET LINK: ", resetUrl);
    console.log("-----------------------------------------");
  });

  return { success: true };
}
