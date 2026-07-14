import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendEmail = async ({ email, subject, html }) => {
  const msg = {
    to: email,
    from: process.env.SENDGRID_VERIFIED_SENDER,
    subject: subject,
    html: html,
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error("SENDGRID ERROR DETAILS:", error.response?.body || error);
    throw new Error("There was an error sending the email. Try again later.");
  }
};

export default sendEmail;

/* ===========================================
   NODEMAILER VERSION (commented out — Render free tier 
   blocks outbound SMTP, causes ETIMEDOUT)
   =========================================== */
/*
import nodemailer from "nodemailer";

const sendEmailNodemailer = async (options) => {
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

export default sendEmailNodemailer;
*/

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