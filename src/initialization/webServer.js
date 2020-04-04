const fs = require('fs');
const express = require('express');
const https = require('https');
const config = require('config');

const logger = require('../common/logger');
const messageHandler = require('../controllers/messageHandler');

const app = express();

const initWebserver = (webServerConfig) => {
    app.use(express.json());

    app.all(`/`, (request, response) => {
        logger.info('Get request to /');
        response.send('Hello world!');
    });

    const URL_FOR_TELEGRAM_WEBHOOK = webServerConfig.urlForTelegramWebhook;
    app.post(URL_FOR_TELEGRAM_WEBHOOK, (request, response) => {
        logger.info(`Get webhook request from Telegram: ${JSON.stringify(request.body)}`);
        messageHandler(request.body.message);
        response.end();
    }).on('error', (error) => {
        logger.error(error);
    });

    const PORT = config.get('server.port');
    https.createServer({
        cert: fs.readFileSync(config.get('certificate.pathToCert')),
        key: fs.readFileSync(config.get('certificate.pathToKey'))
    }, app)
        .listen(PORT, () => {
            logger.info(`Webserver is listening on port ${PORT}`);
            logger.info('Only HTTPS protocol is supported');
        });
};

module.exports = initWebserver;
