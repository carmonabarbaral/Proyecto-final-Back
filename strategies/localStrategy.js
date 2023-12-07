const LocalStrategy = require('passport-local').Strategy;
const { createHash, isValidPassword  } = require('../utils/passwordHash');
const jwt = require('jsonwebtoken');
const Cart = require('../dao/models/cartModels');
const userModels = require('../dao/models/userModels');
const sessions = require('../config/config.js'); // Importar el archivo de configuración

module.exports = new LocalStrategy(
  { passReqToCallback: true, usernameField: 'email' },
  async (req, username, password, done) => {
    try {
      // Buscar al usuario por correo electrónico
      const user = await userModels.findOne({ email: username });

      if (!user) {
        return done(null, false); // Usuario no encontrado
      }

      // Verificar la contraseña
      if (!isValidPassword(password, user.password)) {
        return done(null, false); // Contraseña incorrecta
      }

      // Crear el token JWT
      const payload = {
        userId: user._id,
        exp: Date.now() + 1000 * 60 * 60 // 1 hora
      };

      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Agregar el token al objeto `req`
      req.token = token;

      // Retornar el usuario y el token
      return done(null, user, { token });
    } catch (error) {
      return done(error); // Manejar el error
    }
  }
);