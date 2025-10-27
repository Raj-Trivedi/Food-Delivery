import nodemailer from 'nodemailer';

export async function sendOtpEmail(recipientEmail, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `Zesto Seller Verification <${process.env.MAIL_USER}>`,
    to: recipientEmail,
    subject: 'Your verification code',
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    html: `<p>Your OTP is <b>${otp}</b>.</p><p>This code will expire in 5 minutes.</p>`,
  });

  return info;
}
