const winston = require('winston');
const { createRequestContext } = require('../lib/requestContext');

let filename = `/var/log/omnia/requests/omnia_req.log`;

const addRequestId = (req, res, next) => {
  const { requestId } = createRequestContext();
  req.id = requestId;
  next();
};

const logRequest = (req, res, next) => {
    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        defaultMeta: { service: 'user-service' },
        transports: [
          new winston.transports.File({ filename }),
        ],
    });
    const logObject = {};
    logObject.id = req.id;
    logObject.ip = req.ip;
    logObject.headers = req.headers;
    logObject.body = req.body;
    logger.log('info', logObject);
    next();
}

const requestLogger = (app, product = 'omnia-req', opts) => {
  filename = opts.filename || `/var/log/omnia/requests/${product}.log`;
  app.use(addRequestId);
  app.use(logRequest);
};

module.exports = { addRequestId, requestLogger };
