const config = require('config');

const logger = require('../common/logger');
const dictionary = require('../dictionary');
const telegramMessageSender = require('../services/telegramMessageSender');

const WEBHOOK_SERVER_URL = `https://${config.get('server.host')}:${config.get('server.port')}${dictionary.URL_FOR_TELEGRAM_WEBHOOK}`;

telegramMessageSender.setWebhook(
    WEBHOOK_SERVER_URL,
    config.get('certificate.pathToCert'),
    (error, response) => {
        logger.info(response);

        if (error) {
            logger.error(error);
        } else {
            logger.info(`Telegram will use URL ${WEBHOOK_SERVER_URL} to send webhook requests`);
        }
    }
);
