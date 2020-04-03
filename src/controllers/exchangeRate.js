const logger = require('../common/logger');
const telegramMessageSender = require('../services/telegramMessageSender');
const exchangeRateGetter = require('../services/exchangeRateGetter');

const getUSDRatwe = (chatId) => {
    exchangeRateGetter.getNBUExchangeRate((error, exchangeRates) => {
        if (error) {
            logger.error(error);
        }

        const USDRate = exchangeRates ? exchangeRates.find((rate) => rate.cc === 'USD') : {};
        telegramMessageSender.sendMessage(
            chatId,
            `Курс доллара (НБУ) сегодня - ${USDRate.rate}`,
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
