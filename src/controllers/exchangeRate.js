const logger = require('../common/logger');
const telegramMessageSender = require('../services/telegramMessageSender');
const exchangeRateGetter = require('../services/exchangeRateGetter');

const getUSDRatwe = (chatId) => {
    exchangeRateGetter.getNBUExchangeRate((error, exchangeRates) => {
        let text = '';
        if (error) {
            text = 'Не могу получить курс доллара';
        } else {
            const USDRate = exchangeRates ? exchangeRates.find((rate) => rate.cc === 'USD') : {};
            text = `Курс доллара (НБУ) сегодня - ${USDRate.rate}`;
        }

        telegramMessageSender.sendMessage(
            chatId,
            text,
            (error) => {
                if (error) {
                    logger.error(error);
                }
            }
        );
    });
};

module.exports = {
    getUSDRatwe
};
