const nodemailer = require("nodemailer");
const env = require("../src/config/passport-config");

const nodemailer = require("nodemailer");

async function sendPasswordResetMail(email, resetToken) {
  // Define el servicio y crea el transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Configura las opciones del mail
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    text: `Click on the link to reset your password: http://localhost:${process.env.PORT}/sessions/reset-password/${resetToken}`,
  };

  // Envía el email
  await transporter.sendMail(mailOptions);
}

module.exports = sendPasswordResetMail;