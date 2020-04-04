const config = require('config');

process.on('uncaughtException', (error) => {
    console.log(error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const URL_PATH_FOR_TELEGRAM_WEBHOOK = `/${config.get('telegram.botToken')}`;

require('./src/initialization/configVerification');
require('./src/initialization/webServer')({
    port: config.get('server.port'),
    pathToSSLCert: config.get('certificate.pathToCert'),
    pathToSSLCertKey: config.get('certificate.pathToKey'),
    urlForTelegramWebhook: URL_PATH_FOR_TELEGRAM_WEBHOOK
});
require('./src/initialization/telegramWebhook')({
    serverURLForWebhook: `https://${config.get('server.host')}:${config.get('server.port')}${URL_PATH_FOR_TELEGRAM_WEBHOOK}`,
    pathToSSLCert: config.get('certificate.pathToCert')
});
