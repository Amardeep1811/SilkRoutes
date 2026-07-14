import nodemailer from "nodemailer";

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
