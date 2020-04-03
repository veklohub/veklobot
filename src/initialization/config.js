const envConfig = require('dotenv');
const fs = require('fs');

const logger = require('../common/logger');

const PATH_TO_ENV_CONFIG = './config/.env';

if (!fs.existsSync(PATH_TO_ENV_CONFIG)) {
    logger.error('You have to create ./config/.env file');
    logger.error('You can use ./config/.env_example file as an example of configuration');
    process.exit();
}

envConfig.config({
    path: PATH_TO_ENV_CONFIG
});

if (!process.env.TELEGRAM_API_TOKEN) {
    logger.error('You have to set up TELEGRAM_API_TOKEN in env config');
    process.exit();
}
