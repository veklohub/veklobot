const logger = require('../common/logger');
const exchangeRate = require('./exchangeRate');
const jobs = require('./jobs');
const dictionary = require('../dictionary');

const messageHandler = (message) => {
    if (message.from.is_bot) {
        logger.warn('Message from bot!');
    } else if (message.text && message.text.includes(dictionary.COMMANDS.DOLLAR_RATE)) {
        exchangeRate.getUSDRatwe(message.chat.id);

        jobs.startUSDRateJob(message.chat.id);
    }
};

module.exports = messageHandler;
