var { CronJob } = require('cron');

const logger = require('../common/logger');
const exchangeRate = require('./exchangeRate');

const startUSDRateJob = (chatId) => {
    const job = new CronJob('0 0 10 * * 1-5', function() {
        logger.info(`Planned job startUSDRateJob for ${chatId} is run`);
        exchangeRate.getUSDRate(chatId);
    });
    job.start();
};

module.exports = {
    startUSDRateJob
};
