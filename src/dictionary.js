const dictionary = {
    TELEGRAM_API: `https://api.telegram.org/bot${process.env.TELEGRAM_API_TOKEN}/`,
    URL_FOR_TELEGRAM_WEBHOOK: `/${process.env.TELEGRAM_API_TOKEN}`,
    COMMANDS: {
        DOLLAR_RATE: '/dollar_rate'
    },
    EXCHANGE_RATE_API: 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=20200403&json'
};

module.exports = dictionary;
