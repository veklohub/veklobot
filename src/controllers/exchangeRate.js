const logger = require('../common/logger');
const telegramMessageSender = require('../services/telegramMessageSender');
const exchangeRateGetter = require('../services/exchangeRateGetter');

const getUSDRatwe = (chatId) => {
    exchangeRateGetter.getNBUExchangeRate((error, exchangeRates) => {
        let text = '';
        if (error) {
            logger.error(`NBU API ${dictionary.EXCHANGE_RATE_API} responsed with the error: ${error}`);

            text = 'Не могу получить курс доллара';
        } else {
            const USDRate = exchangeRates ? exchangeRates.find((rate) => rate.cc === 'USD') : {};
            text = `Курс доллара (НБУ) сегодня - ${USDRate.rate}`;
        }

        telegramMessageSender.sendMessage(
            chatId,
            text,
            (error, result) => {
                if (error || !result.ok) {
                    logger.error(`Message to telegram API wasn't delivered: ${error || JSON.stringify(result)}`);
                }
                else {
                    logger.info(`Message was sucsessfully sent to user: ${JSON.stringify(result)}`);
                }
            }
        );
    });
};

module.exports = {
    getUSDRatwe
};
