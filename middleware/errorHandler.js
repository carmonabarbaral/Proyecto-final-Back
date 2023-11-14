const errorCodes = require ('../error/errorCodes');
const customsErrors = require ('../error/customsErrors');


const errorHandlers = {
  // Manejador de errores para la clase CustomError
  CustomError: (err, req, res, next) => {
    const { code, message } = err;
    res.status(code).send({
      error: {
        code,
        message,
      },
    });
  },

  // Manejador de errores para cualquier otro error
  defaultErrorHandler: (err, req, res, next) => {
    const { code = 500, message = 'Error desconocido' } = err;
    res.status(code).send({
      error: {
        code,
        message,
      },
    });
  },
};

module.exports = errorHandlers;