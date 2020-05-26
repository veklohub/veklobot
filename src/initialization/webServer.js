const fs = require('fs');
const express = require('express');
const https = require('https');

const logger = require('../common/logger');
const stringsUtils = require('../services/strings');
const messageHandler = require('../controllers/messageHandler');
const healthCheck = require('../controllers/healthcheck');

const app = express();

const initWebserver = (webServerConfig) => {
    app.use(express.json());

    app.all('*', (request, response, next) => {
        logger.info(`Get request to ${stringsUtils.hideTelegramBotToken(request.path)}`);
        next();
    });

    app.all(`/`, (request, response) => {
        response.send('Hello world!');
    });

    app.all(`/health`, (request, response) => {
        healthCheck.healthcheck((error, status) => {
            response.send(status);
        });
    });

    const URL_FOR_TELEGRAM_WEBHOOK = webServerConfig.urlForTelegramWebhook;
    app.post(URL_FOR_TELEGRAM_WEBHOOK, (request, response) => {
        logger.info(`Get webhook request from Telegram: ${JSON.stringify(request.body)}`);
        messageHandler(request.body);
        response.end();
    }).on('error', (error) => {
        logger.error(error);
    });

    const PORT = webServerConfig.port;
    https.createServer({
        cert: fs.readFileSync(webServerConfig.pathToSSLCert),
        key: fs.readFileSync(webServerConfig.pathToSSLCertKey)
    }, app)
        .listen(PORT, () => {
            logger.info(`Webserver is listening on port ${PORT}`);
            logger.info('Only HTTPS protocol is supported');
        });
};

module.exports = initWebserver;
