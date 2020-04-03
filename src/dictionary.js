const dictionary = {
    TELEGRAM_API: `https://api.telegram.org/bot${process.env.TELEGRAM_API_TOKEN}/`,
    URL_FOR_TELEGRAM_WEBHOOK: `/${process.env.TELEGRAM_API_TOKEN}`,
    COMMANDS: {
        DOLLAR_RATE: "/dollar_rate"
    }
};

module.exports = dictionary;
