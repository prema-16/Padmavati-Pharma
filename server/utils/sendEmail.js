const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: parseInt(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // DNS fix for Render / cloud environments
    tls: {
      rejectUnauthorized: false,
    },
    dnsTimeout: 10000,
    connectionTimeout: 15000,
    greetingTimeout: 10000,
  });

  const info = await transporter.sendMail({
    from: `"${process.env.APP_NAME || "Padmavati Pharma"}" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("Email sent:", info.messageId);
  return info;
};

module.exports = sendEmail;
