import nodemailer from "nodemailer";
// import { Resend } from 'resend'; // Commented out — reverted to Nodemailer for now

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"The Silk Routes" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("NODEMAILER ERROR DETAILS:", error);
    console.error("Error code:", error.code);
    console.error("Error response:", error.response);
    console.error("Error responseCode:", error.responseCode);
    throw error;
  }
};

export default sendEmail;

/* ===========================================
   RESEND VERSION (commented out, for later use)
   ===========================================

import { Resend } from 'resend';

const sendEmailResend = async ({ email, subject, html }) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: 'The Silk Routes <onboarding@resend.dev>', // Resend testing domain
    to: email,
    subject: subject,
    html: html,
  });

  if (error) {
    console.error("RESEND ERROR DETAILS:", error);
    throw new Error("There was an error sending the email. Try again later.");
  }

  return data;
};

export default sendEmailResend;

*/