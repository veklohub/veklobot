const fs = require('fs');
const request = require('request');

const logger = require('../common/logger');
const dictionary = require('../dictionary');

const WEBHOOK_TELEGRAM_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_API_TOKEN}/setWebhook`;
const WEBHOOK_SERVER_URL = `https://${process.env.HOST}:${process.env.PORT}${dictionary.TELEGRAM_WEBHOOK_URL_PATH}`;

request.post({
    url: WEBHOOK_TELEGRAM_URL,
    strictSSL: false,
    formData: {
        url: WEBHOOK_SERVER_URL,
        certificate: fs.createReadStream(process.env.PATH_TO_CERT)
    },
}, function(error, response, body) {
    logger.info(body);

    if (error) {
        logger.error(error);
    } else {
        logger.info(`Telegram will use URL ${WEBHOOK_SERVER_URL} to send webhook requests`);
    }
});
