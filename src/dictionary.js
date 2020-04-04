const { getDateForNbuApi } = require('./services/dates');

const dictionary = {
    COMMANDS: {
        DOLLAR_RATE: '/dollar_rate'
    },
    EXCHANGE_RATE_API: `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${getDateForNbuApi()}&json`
};

module.exports = dictionary;
