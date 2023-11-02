const passport = require('passport');
const registerStrategy = require('../strategies/registerStrategy');
const loginStrategy = require('../strategies/localStrategy');
const githubStrategy = require('../strategies/githubStrategies');
const userModels = require('../dao/models/userModels');

// Nueva variable para almacenar el objeto de opciones de correo electrónico
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: email,
  subject: 'Restablecimiento de contraseña',
  text: `
    <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
    <a href="http://localhost:3000/reset-password?token=${token}">Restablecer contraseña</a>
  `,
};

const forgotPassword = async (email) => {
  // Validar que el correo electrónico sea válido
  if (!isValidEmail(email)) {
    throw new Error('El correo electrónico no es válido');
  }

  // Generar un enlace temporal
  const token = await generateResetPasswordLink(email);

  // Validar que el token de restablecimiento de contraseña sea válido
  if (!isValidToken(token)) {
    throw new Error('El token de restablecimiento de contraseña no es válido');
  }

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

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Restablecimiento de contraseña',
    text: 'Ingresa tu nueva contraseña',
  });
};

module.exports = forgotPassword;