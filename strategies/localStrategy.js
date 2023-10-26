const jwt = require('jsonwebtoken');
const userModels = require('../dao/models/userModels');
const { isValidPassword } = require('../utils/passwordHash');
const { forgotPassword } = require('./forgot-password');



module.exports = async (email, password, link) => {
    try {
      if (link) {
        // Verificar el enlace temporal
        const decoded = JSON.parse(atob(link.split('?')[1]));
  
        if (!decoded || decoded.expiresAt < Date.now()) {
          return null; // Enlace temporal inválido
        }
  
        // Buscar al usuario por correo electrónico
        const user = await userModels.findOne({ email: decoded.email });
  
        if (!user) {
          return null; // Usuario no encontrado
        }
  
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