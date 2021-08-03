<p align="center"><img src="https://raw.githubusercontent.com/kartik1998/omnia-logger/master/logo.png" alt="logger"> </p>
<p align="center"><b> An easy to integrate NodeJS library for easily setting up logging for an express app.</b></p>

<p align="center"><img src="https://img.shields.io/badge/omnia-logger-red" alt="omnia-logger"></p>
<p align="center"><img src="https://img.shields.io/badge/simple-logging-brightgreen" alt="omnia-logger"></p>

## Request Logger

- Generates request, response logs writes a file with those logs.
- Generates a request id for each request session which is visible in app logs. (Read section below on app logger)

### Usage

```javascript
const { requestLogger } = require('omnia-logger');
const app = require('express')();
requestLogger(app, 'product-name', { filename: '/path/to/request.log' });
```

- If you don't pass in a file name request logs are written in `/var/log/omnia/requests` directory by default. In that case ensure that you run your application with root permission i.e. use `sudo` before starting the application.
- Sample request log will look something like:

```javascript
{"meta":{"req":{"url":"/","headers":{"host":"localhost:8080","user-agent":"curl/7.64.1","accept":"*/*"},"method":"GET","httpVersion":"1.1","originalUrl":"/","query":{}},"res":{"body":{"id":"1628002145706-24bf4c89-eaff-4bf3-ad90-a6747e4cc8e8"}},"responseTime":0},"level":"info","message":"HTTP GET /"}
```

- requestLogger logs each request by default. logged keys are: ip, id, headers and body.

## App Logger

- provides a variety of log levels i.e.:

```javascript
FATAL: 'fatal',
ERROR: 'error',
WARN: 'warn',
TRACE: 'trace',
INFO: 'info',
DEBUG: 'debug',
```

- It's singleton in nature hence needs to be initialized only once and can be used like `const logger = require('omnia-logger').appLogger;` in other files.

### Usage

```javascript
const { appLogger, requestLogger } = require('omnia-logger');
const app = require('express')();

const logger = new appLogger('product-name', 'path/to/app_log.log');
requestLogger(app, 'product-name', { filename: '/path/to/req_log.log' });
app.get('/', (req, res) => {
  logger.log(logger.LOG_LEVELS.INFO, 'successfull api call');
  return res.json({ id: req.id });
});

app.listen(8080, () => console.log('listening on', 8080));
```

- Sample app log will look like:

```javascript
[2021-05-04T17:30:37.560Z] [INFO] [apac-logger] [Users-MacBook-Air.local] [20.2.0] [1628002145706-24bf4c89-eaff-4bf3-ad90-a6747e4cc8e8] successfull api call
```

- App log format:

```javascript
[DATE_ISO_FORMAT][LOG_LEVEL][PRODUCT_NAME][OS_HOSTNAME][OS_RELEASE][REQUEST_ID] LOG_MESSAGE
```
