const config = require('config');

const logger = require('../common/logger');
const dictionary = require('../dictionary');
const telegramMessageSender = require('../services/telegramMessageSender');

const WEBHOOK_SERVER_URL = `https://${config.get('server.host')}:${config.get('server.port')}`;

telegramMessageSender.setWebhook(
    `WEBHOOK_SERVER_URL${dictionary.URL_FOR_TELEGRAM_WEBHOOK}`,
    config.get('certificate.pathToCert'),
    (error, response) => {
        logger.info(response);

        if (error) {
            logger.error(`Something went wrong during subscription to telegram webhook: ${error}`);
        } else {
            if (response.ok) {
                logger.info(`Telegram will use URL ${WEBHOOK_SERVER_URL}\YOUR_TELEGRAM_BOR_TOKEN to send webhook requests`);
            } else {
                logger.error(`Something went wrong during subscription to telegram webhook: ${response}`);
            }
        }
    }
);
