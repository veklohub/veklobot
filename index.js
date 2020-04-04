
process.on('uncaughtException', (error) => {
    console.log(error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

require('./src/initialization/configVerification');
require('./src/initialization/webServer');
require('./src/initialization/telegramWebhook');
