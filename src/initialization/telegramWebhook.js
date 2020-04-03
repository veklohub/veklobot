const logger = require('../common/logger');
const dictionary = require('../dictionary');
const telegramMessageSender = require('../services/telegramMessageSender');

const WEBHOOK_SERVER_URL = `https://${process.env.HOST}:${process.env.PORT}${dictionary.URL_FOR_TELEGRAM_WEBHOOK}`;

telegramMessageSender.setWebhook(
    WEBHOOK_SERVER_URL,
    process.env.PATH_TO_CERT,
    (error, response) => {
        logger.info(response);

        if (error) {
            logger.error(error);
        } else {
            logger.info(`Telegram will use URL ${WEBHOOK_SERVER_URL} to send webhook requests`);
        }
    }
);
