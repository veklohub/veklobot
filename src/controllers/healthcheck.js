const logger = require('../common/logger');
const { getWebhookInfo } = require('../services/telegramMessageSender');

const healthcheck = (callback) => {
    let status = {};
    getWebhookInfo((error, webHookStatus) => {
        status.telegramWebhook = webHookStatus;

        logger.info(`Current healthcheck status: ${JSON.stringify(status)}`);
        callback(undefined, status);
    });
};

module.exports = {
    healthcheck
};
