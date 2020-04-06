var { CronJob } = require('cron');
const config = require('config');

const logger = require('../common/logger');
const exchangeRate = require('./exchangeRate');

const startUSDRateJob = (chatId) => {
    const cronPattern = '0 0 10 * * 1-5';
    const timezone = config.get('job.timeZone');
    const job = new CronJob(cronPattern, function() {
        logger.info(`Planned job startUSDRateJob for ${chatId} is run`);
        exchangeRate.getUSDRate(chatId);
    }, null, true, timezone);
    job.start();

    logger.info(`Added new job USDRate for chat id ${chatId}. Cron pattern for job is  ${cronPattern}, timexone = ${timezone}`);
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
};

module.exports = {
    addJob
};
