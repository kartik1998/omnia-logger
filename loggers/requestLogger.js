const { createRequestContext, getRequestContext } = require('../lib/requestContext');

const requestLogger = (req, res, next) => {
    const { requestId } = createRequestContext();
    req.id = requestId;
    next();
}

module.exports = requestLogger;