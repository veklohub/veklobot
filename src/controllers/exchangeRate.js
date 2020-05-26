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

const getUSDRate = (chatId, isFirstTime) => {
    if (!chatId) {
        return logger.error('Cannot handle without chatId');
    }

    callbackRetry(exchangeRateGetter.getNBUExchangeRate,(error, exchangeRates) => {
        let message = '';
        if (error) {
            logger.error(`NBU API responsed with the error: ${error}`);

            message = 'Не могу получить курс доллара';
        } else {
            const USDRate = exchangeRates ? exchangeRates.find((rate) => rate.cc === 'USD') : {};
            message = `Курс доллара (НБУ) сегодня - ${USDRate.rate}`;
        }

        if (isFirstTime) {
            message = `${message}. В дальнейшем я буду присылать тебе курс доллара каждый будний день в 10 утра`;
        }

        telegramMessageSender.sendMessage({
            chatId,
            message
        });
    });
};

module.exports = {
    getUSDRate
};
