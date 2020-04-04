const logger = require('../common/logger');
const exchangeRate = require('./exchangeRate');
const jobs = require('./jobs');
const commands = require('../consts/commands');

const messageHandler = (message) => {
    if (message.from.is_bot) {
        logger.warn('Message from bot!');
    } else if (message.text && message.text.includes(commands.DOLLAR_RATE)) {
        exchangeRate.getUSDRatwe(message.chat.id);

        jobs.startUSDRateJob(message.chat.id);
    }
};

module.exports = messageHandler;
