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

const existingJobsList = [];
const jobHandlers = {
    USDRate: startUSDRateJob
};

const addJob = (jobName, chatId) => {
    if (!jobName || !chatId || !jobHandlers[jobName]) {
        logger.error(`Got incorrect request for job creation with jobName ${jobName} and chatId ${chatId}`);
        return;
    }

    const jobFromExistingList = existingJobsList.find(job => job.name === jobName && job.chatId === chatId);
    if (jobFromExistingList) {
        logger.info(`Got task on creation job ${jobName} for chat id ${chatId}, but such job already exists. Will do nothing`);
        return;
    }

    jobHandlers[jobName](chatId);
    existingJobsList.push({
        name: jobName,
        chatId
    });
    logger.info(`Added new job ${jobName} for chat id ${chatId}`);
};

module.exports = {
    addJob
};
