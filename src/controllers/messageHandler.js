const get = require('lodash/get');

const logger = require('../common/logger');
const exchangeRate = require('./exchangeRate');
const jobs = require('./jobs');
const commands = require('../consts/commands');

const messageHandler = (message) => {
    if (get(message, 'from.is_bot')) {
        logger.warn('Message from bot!');
    } else if (get(message, 'text') && message.text.includes(commands.DOLLAR_RATE)) {
        exchangeRate.getUSDRate(message.chat.id);

        jobs.startUSDRateJob(message.chat.id);
    }
};

module.exports = messageHandler;
