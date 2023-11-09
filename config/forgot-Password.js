const nodemailer = require('nodemailer');

const forgotPassword = async (email) => {
  // Validar que el correo electrónico sea válido
  if (!isValidEmail(email)) {
    throw new Error('El correo electrónico no es válido');
  }

  // Generar el enlace temporal
  const token = await generateSecureResetPasswordLink();

  // Actualizar la fecha de expiración del token en la base de datos
  const user = await userModels.findOne({ email });

  if (user) {
    user.expirationDate = new Date(Date.now() + 3600 * 1000); // 1 hora
    await user.save();
  }

  // Enviar el correo de restablecimiento de contraseña
  const transporter = await nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Restablecimiento de contraseña',
    text: `
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="http://localhost:3000/reset-password?token=${token}">Restablecer contraseña</a>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = forgotPassword;