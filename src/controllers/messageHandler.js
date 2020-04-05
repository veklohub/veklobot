const logger = require('../common/logger');
const exchangeRate = require('./exchangeRate');
const jobs = require('./jobs');
const commands = require('../consts/commands');

const messageHandler = (message) => {
    if (!message || !message.text || !message.chat || !message.chat.id || !message.from) {
        logger.warn(`Got strange empty message: ${message}`);
    } else if (message.from.is_bot) {
        logger.warn(`Message from bot, didn't handle it: ${message}`);
    } else if (message.text.includes(commands.DOLLAR_RATE)) {
        exchangeRate.getUSDRate(message.chat.id);

        jobs.startUSDRateJob(message.chat.id);
    }
};

module.exports = messageHandler;
