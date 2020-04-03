const envConfig = require('dotenv');
const fs = require('fs');
const winston = require('winston');
const express = require('express');
const https = require('https');

const PATH_TO_ENV_CONFIG = './config/.env';

process.on('uncaughtException', function (error) {
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
    logger.error('You have to set up TELEGRAM_API_TOKEN in your .env file');
    process.exit();
}

// init web server
const app = express();
app.use(express.json());

app.post(`/${process.env.TELEGRAM_API_TOKEN}`, function (request, response) {
    logger.indo(request.body);
    response.end();
});

const PORT = process.env.PORT || 3000;
https.createServer({
    key: fs.readFileSync(process.env.PATH_TO_CERT_KEY),
    cert: fs.readFileSync(process.env.PATH_TO_CERT)
}, app)
    .listen(PORT, () => {
        logger.info(`Webserver is listening on port ${PORT}`);
    });

logger.info('App is successfully started');
