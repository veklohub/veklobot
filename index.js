const config = require('config');

process.on('uncaughtException', (error) => {
    console.log(error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const URL_FOR_TELEGRAM_WEBHOOK = `/${config.get('telegram.botToken')}`;

require('./src/initialization/configVerification');
require('./src/initialization/webServer')({
    urlForTelegramWebhook: URL_FOR_TELEGRAM_WEBHOOK
});
require('./src/initialization/telegramWebhook')({
    urlForTelegramWebhook: URL_FOR_TELEGRAM_WEBHOOK
});
