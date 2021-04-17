const appLogger = require('./loggers/appLogger');

const logger = appLogger();

logger.log(logger.LOG_LEVELS.ERROR, 'This is up', 'reqid');

module.exports = {
  appLogger,
};
