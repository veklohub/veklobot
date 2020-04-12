const logger = require('../common/logger');
const telegramMessageSender = require('../services/telegramMessageSender');
const exchangeRateGetter = require('../services/exchangeRateGetter');

const callbackRetry = (fn, callback, retriesCount, ms) => {
    logger.info('Sending request to NBU API for exchange rate');
    ms = ms || 10;
    retriesCount = typeof(retriesCount) === 'undefined' ? 3 : retriesCount;
    fn((error, result) => {
        if (error && retriesCount > 0) {
            logger.error(`NBU API responsed with the error: ${error}`);
            logger.info(`Retrying in ${ms}ms...`);
            setTimeout(() => {
                callbackRetry(fn, callback, retriesCount - 1, ms);
            }, ms);
        } else {
            callback(error, result);
        }
    });
};

const getUSDRate = (chatId) => {
    if (!chatId) {
        return logger.error('Cannot handle without chatId');
    }

    callbackRetry(exchangeRateGetter.getNBUExchangeRate,(error, exchangeRates) => {
        let text = '';
        if (error) {
            logger.error(`NBU API responsed with the error: ${error}`);

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
                } else {
                    logger.info(`Message was sucsessfully sent to user: ${JSON.stringify(result)}`);
                }
            }
        );
    });
};

module.exports = {
    getUSDRate
};
