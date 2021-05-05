const winston = require('winston');
const { createRequestContext } = require('../lib/requestContext');
const expressWinston = require('express-winston');

let filename = `./omnia_req.log`;

const addRequestId = (req, res, next) => {
  const { requestId } = createRequestContext();
  req.id = requestId;
  next();
};

const requestLogger = (app, product = 'omnia-req', opts) => {
  filename = opts.filename || `/var/log/omnia/requests/${product}.log`;
  app.use(addRequestId);
  app.use(expressWinston.logger({
    transports: [
      new winston.transports.File({ filename }),
    ],
    format: winston.format.combine(
      winston.format.json()
    )
  }));
};

module.exports = { addRequestId, requestLogger };
