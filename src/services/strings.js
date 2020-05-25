
const hideTelegramBotToken = (url) => url.replace(/\d{6,}:[\w\d-_]{35,}/, 'YOUR_TELEGRAM_BOT_TOKEN');

module.exports = {
    hideTelegramBotToken
};
