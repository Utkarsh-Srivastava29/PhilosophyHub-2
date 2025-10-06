import { createTransport } from 'nodemailer';
import { configDotenv } from 'dotenv';
configDotenv();
export const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

export const otpMailOptions = (otp,email) => {return {
    from:{
      name: "Philosophy Hub",
      address: process.env.SMTP_USER,
    },
    to: email,
    subject: "Otp Verification Email",
    priority: "high",
    headers: {
      'Precedence': 'bulk',
    },
    html: `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <img src="your-logo-url" alt="Logo" style="max-width: 150px; margin-bottom: 20px;">
          <h1 style="color: #1f2937; margin-bottom: 20px;">Verify Your Email</h1>
          <p style="color: #4b5563; margin-bottom: 20px;">Your verification code is:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; margin-bottom: 20px;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #2563eb;">${otp}</span>
          </div>
          <p style="color: #4b5563; margin-bottom: 20px;">This code will expire in 10 minutes.</p>
          <p style="color: #4b5563; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            This is an automated message, please do not reply.
          </p>
        </div>
      </body>
    </html>`,
    text: `Your verification code is: ${otp}. This code will expire in 10 minutes. If you didn't request this code, please ignore this email.`,
  }}
