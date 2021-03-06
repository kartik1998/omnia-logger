const winston = require('winston');
const os = require('os');
const { getRequestContext } = require('../lib/requestContext');

const { LOG_LEVEL_SEVERITY, LOG_LEVELS } = require('../config/logConfig');
const MESSAGE = Symbol.for('message');

const getDefaultLogFilePath = (processName = 'node') => `/var/log/omni/node/${processName}.log`;

const omniLogFormat = winston.format((info) => {
  const infoCopy = Object.assign({}, info);
  infoCopy[MESSAGE] = `[${new Date().toISOString()}] [${info.level.toUpperCase()}] [${info.message.product}] [${
    os.hostname
  }] [${os.release}] [${info.message.requestId}] ${info.message.message}`;
  return infoCopy;
})();

const appLogger = function logger(product, logFile, logToConsole = false) {
  this.LOG_LEVELS = LOG_LEVELS;
  let instance = this;
  if (appLogger.prototype._singletonInstance) {
    instance = appLogger.prototype._singletonInstance;
  } else {
    instance.logger = winston.createLogger({
      format: omniLogFormat,
      levels: LOG_LEVEL_SEVERITY,
    });
  }
  appLogger.prototype._singletonInstance = instance;
  instance.product = product || instance.product;
  instance.logFile = logFile || instance.logFile || getDefaultLogFilePath(instance.processName);
  const fileTransport = new winston.transports.File({
    filename: instance.logFile,
    level: LOG_LEVELS.DEBUG,
  });
  instance.logger.clear().add(fileTransport);

  instance.log = (loglevel, message, requestId) => {
    const context = getRequestContext();
    if (context) requestId = context.requestId;
    const logMsg = {
      product: instance.product,
      message,
      requestId,
      level: loglevel,
    };
    if (logToConsole) console.log(JSON.stringify(logMsg));
    instance.logger.log({
      level: loglevel,
      message: logMsg,
    });
  };

  instance.info = instance.log.bind(instance, LOG_LEVELS.INFO);
  instance.error = instance.log.bind(instance, LOG_LEVELS.ERROR);
  instance.warn = instance.log.bind(instance, LOG_LEVELS.WARN);
  instance.debug = instance.log.bind(instance, LOG_LEVELS.DEBUG);
  instance.fatal = instance.log.bind(instance, LOG_LEVELS.FATAL);
  instance.trace = instance.log.bind(instance, LOG_LEVELS.TRACE);

  return instance;
};

module.exports = appLogger;
