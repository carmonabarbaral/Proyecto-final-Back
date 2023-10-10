const errorCodes = require('../config/errorCodes');

const errorHandler = (err, req, res, next) => {
  // Aquí puedes personalizar el manejo de errores en función del tipo de error.
  // Por ejemplo, puedes usar el diccionario de errores para manejar los errores de manera específica.

  const statusCode = err.statusCode || 500;
  const message = errorCodes[err.code] || err.message;

  res.status(statusCode).json({
    message,
  });
};

module.exports = errorHandler;