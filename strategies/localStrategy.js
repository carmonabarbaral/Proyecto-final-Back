const jwt = require('jsonwebtoken');
const userModels = require('../dao/models/userModels');
const { isValidPassword } = require('../utils/passwordHash');
const {forgotPassword}= require('../config/forgot-Password');

// Función para verificar el enlace temporal
const verifyResetPasswordLink = (link) => {
  const decoded = JSON.parse(atob(link.split('?')[1]));

  if (!decoded || decoded.expiresAt < Date.now()) {
    return false; // Enlace temporal inválido
  }

  return true;
};

// Función para impedir que los usuarios restablezcan la contraseña con la misma contraseña que tenían anteriormente
const preventSamePasswordReset = (user, newPassword) => {
  if (newPassword === user.password) {
    throw new Error('No puedes restablecer la contraseña con la misma contraseña que tenías anteriormente');
  }
};

// Función para generar un hash seguro para el enlace temporal
const generateSecureResetPasswordLink = async () => {
  // Generar un hash aleatorio
  const hash = await crypto.randomBytes(32);

  // Convertir el hash a un string
  const token = hash.toString('hex');

  return token;
};

module.exports = async (email, password, link) => {
  try {
    if (link) {
      // Verificar el enlace temporal
      const isValidLink = verifyResetPasswordLink(link);

      if (!isValidLink) {
        return null; // Enlace temporal inválido
      }

      // Buscar al usuario por correo electrónico
      const user = await userModels.findOne({ email: decoded.email });

      if (!user) {
        return null; // Usuario no encontrado
      }

      // Impedir que el usuario restablezca la contraseña con la misma contraseña que tenía anteriormente
      preventSamePasswordReset(user, password);

      // Actualizar la contraseña del usuario
      user.password = password;
      await user.save();

      return true; // Contraseña restablecida correctamente
    } else {
      // Autenticación normal
      const user = await userModels.findOne({ email: email });

      if (!user || !isValidPassword(password, user.password)) {
        return null; // Autenticación fallida
      }

      // Genera un JWT con la información del usuario
      const payload = {
        userId: user._id,
        email: user.email,
        // Puedes incluir otros datos relevantes aquí
        role: user.role,
      };

      // Crea y firma el JWT
      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });

      return token; // Devuelve el JWT al cliente
    }
  } catch (error) {
    throw error;
  }
};