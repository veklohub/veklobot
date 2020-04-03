const envConfig = require('dotenv');
const fs = require('fs');
const winston = require('winston');
const express = require('express');
const https = require('https');
const request = require('request');

const PATH_TO_ENV_CONFIG = './config/.env';

process.on('uncaughtException', (error) => {
    console.log(error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// init logger
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint()
    ),
    transports: [
        new winston.transports.File({ filename: './logs/combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

// get env config
if (!fs.existsSync(PATH_TO_ENV_CONFIG)) {
    logger.error('You have to create ./config/.env file');
    logger.error('You can use ./config/.env_example file as an example of configuration');
    process.exit();
}

envConfig.config({
    path: PATH_TO_ENV_CONFIG
});

if (!process.env.TELEGRAM_API_TOKEN) {
    logger.error('You have to set up TELEGRAM_API_TOKEN in env config');
    process.exit();
}

// init web server
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

const TELEGRAM_WEBHOOK_URL_PATH = `/${process.env.TELEGRAM_API_TOKEN}`;
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
    });

// register to Telegram webhooks
const WEBHOOK_TELEGRAM_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_API_TOKEN}/setWebhook`;
const WEBHOOK_SERVER_URL = `https://${process.env.HOST}:${process.env.PORT}${TELEGRAM_WEBHOOK_URL_PATH}`;

request.post({
    url: WEBHOOK_TELEGRAM_URL,
    formData: {
        url: WEBHOOK_SERVER_URL,
        certificate: fs.createReadStream(CERT)
    },
}, function(error, response, body) {
    logger.info(body);

    if (error) {
        logger.error(error);
    } else {
        logger.info(`Telegram will use URL ${WEBHOOK_SERVER_URL} to send webhook requests`);
    }
});

logger.info('App is successfully started');
