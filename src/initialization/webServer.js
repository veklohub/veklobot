const fs = require('fs');
const express = require('express');
const https = require('https');

const logger = require('../common/logger');
const dictionary = require('../dictionary');

const CERT_KEY = process.env.PATH_TO_CERT_KEY;
const CERT = process.env.PATH_TO_CERT;

if (!fs.existsSync(CERT_KEY) || !fs.existsSync(CERT)) {
    if (!fs.existsSync(CERT)) {
        logger.error('Cannot get access to your certificate');
    }
    if (!fs.existsSync(CERT_KEY)) {
        logger.error('Cannot get access to your certificate key');
    }
    logger.error('Please verify that file exists and path to file in env config was configured correctly');
    process.exit();
}
const app = express();
app.use(express.json());

app.all(`/`, (request, response) => {
    logger.info('Get request to /');
    response.send('Hello world!');
});

const TELEGRAM_WEBHOOK_URL_PATH = dictionary.TELEGRAM_WEBHOOK_URL_PATH;
app.post(TELEGRAM_WEBHOOK_URL_PATH, (request, response) => {
    logger.info(`Get webhook request from Telegram: ${JSON.stringify(request.body)}`);
    response.end();
}).on('error', (error) => {
    logger.error(error);
});

const PORT = process.env.PORT || 443;
https.createServer({
    key: fs.readFileSync(CERT_KEY),
    cert: fs.readFileSync(CERT)
}, app)
    .listen(PORT, () => {
        logger.info(`Webserver is listening on port ${PORT}`);
        logger.info('Only HTTPS protocol is supported');
    });