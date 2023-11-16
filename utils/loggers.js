const winston = require("winston");

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "yellow",
    warning: "orange",
    info: "green",
    http: "blue",
    debug: "white",
  },
};

const logger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.Console({
      level: "http",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevels.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "error.log",
      level: "warning",
      format: winston.format.simple(),
    }),
  ],
});

module.exports = addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.http(
    `${req.method} en ${req.url} - ${new Date().toLocaleString()}`
  );
  next();
};



