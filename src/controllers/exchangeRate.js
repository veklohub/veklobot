const logger = require('../common/logger');
const telegramMessageSender = require('../services/telegramMessageSender');
const exchangeRateGetter = require('../services/exchangeRateGetter');

const exchangeRate = (message) => {
    exchangeRateGetter.getNBUExchangeRate((error, exchangeRates) => {
        if (error) {
            logger.error(error);
        }

        const USDRate = exchangeRates.find((rate) => rate.cc === 'USD');
        telegramMessageSender.sendMessage(
            message.chat.id,
            `Привет, ${message.from.first_name || message.from.username}. Доллар по курсу НБУ на сегодня составляет ${USDRate.rate}`,
            (error) => {
                if (error) {
                    logger.error(error);
                }
            }
        );
    });
};

module.exports = exchangeRate;
