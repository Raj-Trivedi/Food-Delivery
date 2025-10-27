import nodemailer from 'nodemailer';

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Sends an OTP email to the specified recipient
 * @param {string} to - Recipient email address
 * @param {string} otp - The OTP to send
 * @returns {Promise<Object>} - Result of the email sending operation
 */
export const sendOTPEmail = async (to, otp) => {
  try {
    const mailOptions = {
      from: `"Food Delivery App" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject: 'Seller Account Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Thank you for registering as a seller. Please use the following OTP to verify your email address:</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="margin: 0; font-size: 32px; letter-spacing: 5px; color: #333;">${otp}</h1>
          </div>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr>
          <p style="font-size: 12px; color: #666;">This is an automated message, please do not reply.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

/**
 * Sends a verification success email
 * @param {string} to - Recipient email address
 * @param {string} sellerName - Name of the seller
 * @returns {Promise<Object>} - Result of the email sending operation
 */
export const sendVerificationSuccessEmail = async (to, sellerName) => {
  try {
    const mailOptions = {
      from: `"Food Delivery App" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject: 'Account Verified Successfully',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Food Delivery App, ${sellerName}!</h2>
          <p>Your seller account has been successfully verified and is now active.</p>
          <p>You can now log in to your seller dashboard and start managing your restaurant.</p>
          <p>Thank you for joining us!</p>
          <hr>
          <p style="font-size: 12px; color: #666;">This is an automated message, please do not reply.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending verification success email:', error);
    throw new Error('Failed to send verification success email');
  }
};
