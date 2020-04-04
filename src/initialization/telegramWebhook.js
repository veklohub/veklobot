const logger = require('../common/logger');
const telegramMessageSender = require('../services/telegramMessageSender');

const setUpTelegramWebhook = (webHookConfig) => {
    telegramMessageSender.setWebhook(
        `${webHookConfig.serverURLForWebhook}`,
        webHookConfig.pathToSSLCert,
        (error, response) => {
            if (error || !response.ok) {
                logger.error(`Something went wrong during subscription to telegram webhook: ${error || JSON.stringify(response)}`);
            } else {
                logger.info(`Telegram will use URL ${webHookConfig.serverURLForWebhook.replace(/\d{6,}:[\w\d-_]{35,}/, 'YOUR_TELEGRAM_BOT_TOKEN')} to send webhook requests. Response from Telegram API: ${JSON.stringify(response)}`);
            }
        }
    );
};

module.exports = setUpTelegramWebhook;
