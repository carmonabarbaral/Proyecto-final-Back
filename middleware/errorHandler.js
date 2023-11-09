const errorCodes = require('../config/errorCodes');

const errorHandler = (err, req, res, next) => {
  // ...
  if (res && res.status) {
    // El objeto res existe y tiene una propiedad status
    res.status(500).send('Error desconocido');
  } else {
    // El objeto res no existe o no tiene una propiedad status
    res.send('Error desconocido');
  }
};

module.exports = errorHandler;