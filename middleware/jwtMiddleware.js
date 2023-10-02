// jwtMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const jwtMiddleware = (req, res, next) => {
  // Obtén el token del encabezado de la solicitud
  const token = req.header('Authorization');

  // Verifica si el token está presente
  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado. Token no proporcionado.' });
  }

  try {
    // Verifica y decodifica el token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Agrega la información decodificada del usuario a la solicitud para su posterior uso
    req.user = decoded;

    // Continúa con el siguiente middleware o la ruta
    next();
  } catch (error) {
    // Maneja el error si el token no es válido
    console.error('Error de verificación de JWT:', error);
    return res.status(401).json({ error: 'Acceso no autorizado. Token no válido.' });
  }
};

module.exports = jwtMiddleware;
