const config = require('config');

const logger = require('../common/logger');
const telegramMessageSender = require('../services/telegramMessageSender');

const WEBHOOK_SERVER_URL = `https://${config.get('server.host')}:${config.get('server.port')}`;

const setUpTelegramWebhook = (webHookConfig) => {
    telegramMessageSender.setWebhook(
        `${WEBHOOK_SERVER_URL}${webHookConfig.urlForTelegramWebhook}`,
        config.get('certificate.pathToCert'),
        (error, response) => {
            if (error || !response.ok) {
                logger.error(`Something went wrong during subscription to telegram webhook: ${error || JSON.stringify(response)}`);
            } else {
                logger.info(`Telegram will use URL ${WEBHOOK_SERVER_URL}\YOUR_TELEGRAM_BOR_TOKEN to send webhook requests. Response from Telegram API: ${JSON.stringify(response)}`);
            }
        }
    );
};

module.exports = setUpTelegramWebhook;
