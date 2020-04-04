const config = require('config');

const { getDateForNbuApi } = require('./services/dates');

const dictionary = {
    URL_FOR_TELEGRAM_WEBHOOK: `/${config.get('telegram.botToken')}`,
    COMMANDS: {
        DOLLAR_RATE: '/dollar_rate'
    },
    EXCHANGE_RATE_API: `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${getDateForNbuApi()}&json`
};

module.exports = dictionary;
