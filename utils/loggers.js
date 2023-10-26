const winston = require('winston');

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



module.exports = logger;