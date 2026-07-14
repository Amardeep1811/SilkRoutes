import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ email, subject, html }) => {
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

export default sendEmail;
