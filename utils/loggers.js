const winston = require('winston')

const logger = winston.createLogger({
  levels: {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5,
  },
  transports: [
    new winston.transports.Console({
      level: 'debug',
    }),
    new winston.transports.File({
      level: 'error',
      filename: 'errors.log',
    }),
  ],
});

app.get('/loggerTest', (req, res) => {
    logger.debug('Este es un mensaje de debug.');
    logger.info('Este es un mensaje de información.');
    logger.warn('Este es un mensaje de advertencia.');
    logger.error('Este es un mensaje de error.');
    logger.fatal('Este es un mensaje fatal.');
  
    res.send('Todos los logs se han enviado correctamente.');
  });

module.exports = logger;