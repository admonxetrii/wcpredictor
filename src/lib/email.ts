import nodemailer from "nodemailer";

export const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Using a hosted PNG image since SVGs are blocked by major email clients
const trophySvg = `<img src="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/trophy.png" width="32" height="32" alt="Trophy" style="vertical-align: middle; margin-right: 8px; display: inline-block; border: none; outline: none; text-decoration: none;" />`;

export const getBaseEmailTemplate = (title: string, content: string) => `
  <div style="font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1A3C34; color: #F5EFE6; border-radius: 20px; overflow: hidden; border: 1px solid rgba(197, 160, 89, 0.3); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
    <div style="background-color: #2D5A4E; padding: 40px 20px; text-align: center; border-bottom: 2px solid #C5A059;">
      <h1 style="color: #C5A059; margin: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase;">
        ${trophySvg}
        FIFA WC 2026 Predictor
      </h1>
    </div>
    <div style="padding: 40px 30px; background-color: #1A3C34;">
      <h2 style="color: #F5EFE6; font-size: 24px; margin-top: 0; font-family: 'Playfair Display', Georgia, serif;">${title}</h2>
      <div style="height: 2px; max-width: 200px; background: linear-gradient(90deg, transparent, #C5A059, transparent); margin: 0 0 20px 0;"></div>
      
      ${content}
      
    </div>
    <div style="background-color: #2D5A4E; padding: 30px 20px; text-align: center; border-top: 1px solid rgba(197, 160, 89, 0.4);">
      <div style="margin-bottom: 15px;">
        <span style="color: #C5A059; font-weight: bold; font-size: 18px; font-family: 'Playfair Display', Georgia, serif;">${trophySvg} FIFA WC 2026 Predictor</span>
      </div>
      <div style="margin-bottom: 15px;">
        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/rules" style="color: rgba(245, 239, 230, 0.7); text-decoration: none; font-size: 14px;">Rules & Format</a>
      </div>
      <p style="color: rgba(245, 239, 230, 0.5); font-size: 12px; margin: 0;">&copy; 2026 Nisham Wagle. All rights reserved.</p>
    </div>
  </div>
`;

export async function sendRegistrationEmail(email: string, name: string) {
  const content = `
    <p style="color: rgba(245, 239, 230, 0.9); font-size: 16px; line-height: 1.6;">Hello <span style="color: #C5A059; font-weight: bold;">${name}</span>,</p>
    <p style="color: rgba(245, 239, 230, 0.9); font-size: 16px; line-height: 1.6;">You have registered successfully. However, your account is currently pending approval.</p>
    <p style="color: rgba(245, 239, 230, 0.9); font-size: 16px; line-height: 1.6;"><strong>Please contact your admin to make your account approved.</strong></p>
    <p style="color: rgba(245, 239, 230, 0.6); font-size: 14px; line-height: 1.6; border-top: 1px dashed rgba(197, 160, 89, 0.3); padding-top: 20px;">Once approved, you will receive another email and gain full access to the Predictor Dashboard.</p>
  `;
  const html = getBaseEmailTemplate("Registration Pending Approval", content);
  const transporter = getTransporter();

  transporter.sendMail({
    from: process.env.SMTP_FROM || '"FIFA WC 2026 Predictor" <noreply@wcpredictor.com>',
    to: email,
    subject: "Registration Pending Approval - FIFA WC 2026 Predictor",
    html,
  }).catch((error) => console.error("Failed to send registration email", error));
}

export async function sendApprovalEmail(email: string, name: string) {
  const loginUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/signin`;
  const content = `
    <p style="color: rgba(245, 239, 230, 0.9); font-size: 16px; line-height: 1.6;">Hello <span style="color: #C5A059; font-weight: bold;">${name}</span>,</p>
    <p style="color: rgba(245, 239, 230, 0.9); font-size: 16px; line-height: 1.6;">Great news! Your account has been officially approved by the admins.</p>
    <p style="color: rgba(245, 239, 230, 0.9); font-size: 16px; line-height: 1.6;">You now have full access to the Dashboard to track your points and compete on the Global Leaderboard.</p>
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(to right, #C5A059, #E8D5A3); color: #2C2C2C; font-weight: bold; font-size: 16px; text-decoration: none; padding: 15px 30px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 25px -5px rgba(197, 160, 89, 0.4);">Sign In Now</a>
    </div>
  `;
  const html = getBaseEmailTemplate("Account Approved!", content);
  const transporter = getTransporter();

  transporter.sendMail({
    from: process.env.SMTP_FROM || '"FIFA WC 2026 Predictor" <noreply@wcpredictor.com>',
    to: email,
    subject: "Account Approved - FIFA WC 2026 Predictor",
    html,
  }).catch((error) => console.error("Failed to send approval email", error));
}

export async function sendMatchResultEmailsBatch(users: {email: string, name?: string | null}[], matchInfo: string) {
  const content = `
    <p style="color: rgba(245, 239, 230, 0.9); font-size: 16px; line-height: 1.6;">Hello,</p>
    <p style="color: rgba(245, 239, 230, 0.9); font-size: 16px; line-height: 1.6;">The match result for <span style="color: #C5A059; font-weight: bold;">${matchInfo}</span> has been finalized and scores are updated!</p>
    <p style="color: rgba(245, 239, 230, 0.9); font-size: 16px; line-height: 1.6;">Check the global leaderboard to see how your points have changed.</p>
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/leaderboard" style="display: inline-block; background: linear-gradient(to right, #C5A059, #E8D5A3); color: #2C2C2C; font-weight: bold; font-size: 16px; text-decoration: none; padding: 15px 30px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 25px -5px rgba(197, 160, 89, 0.4);">View Leaderboard</a>
    </div>
  `;
  const html = getBaseEmailTemplate("Match Result Updated!", content);
  const transporter = getTransporter();

  const emails = users.map(u => u.email).filter(Boolean);
  if(emails.length === 0) return;

  transporter.sendMail({
    from: process.env.SMTP_FROM || '"FIFA WC 2026 Predictor" <noreply@wcpredictor.com>',
    bcc: emails,
    subject: `Match Result Updated: ${matchInfo}`,
    html,
  }).catch((error) => console.error("Failed to send batch match result emails", error));
}

export async function sendMatchReminderEmailsBatch(users: {email: string, name?: string | null}[], matchInfo: string, startsInMinutes: number) {
  const hours = Math.floor(startsInMinutes / 60);
  const minutes = startsInMinutes % 60;
  const timeParts = [];
  if (hours > 0) timeParts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  if (minutes > 0) timeParts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  const timeString = timeParts.join(' and ') || 'less than a minute';

  const content = `
    <p style="color: rgba(245, 239, 230, 0.9); font-size: 16px; line-height: 1.6;">Hello,</p>
    <p style="color: rgba(245, 239, 230, 0.9); font-size: 16px; line-height: 1.6;">The match <span style="color: #C5A059; font-weight: bold;">${matchInfo}</span> is starting in about ${timeString}!</p>
    <p style="color: rgba(245, 239, 230, 0.9); font-size: 16px; line-height: 1.6;">You have not logged your prediction yet. Time is running out. Lock in your predictions now before the match starts!</p>
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; background: linear-gradient(to right, #C5A059, #E8D5A3); color: #2C2C2C; font-weight: bold; font-size: 16px; text-decoration: none; padding: 15px 30px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 25px -5px rgba(197, 160, 89, 0.4);">Predict Now</a>
    </div>
  `;
  const html = getBaseEmailTemplate(`Match Starting Soon: ${matchInfo}`, content);
  const transporter = getTransporter();

  const emails = users.map(u => u.email).filter(Boolean);
  if(emails.length === 0) return;

  transporter.sendMail({
    from: process.env.SMTP_FROM || '"FIFA WC 2026 Predictor" <noreply@wcpredictor.com>',
    bcc: emails,
    subject: `Action Required: Match ${matchInfo} starting soon!`,
    html,
  }).catch((error) => console.error("Failed to send batch match reminder emails", error));
}
