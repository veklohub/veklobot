const config = require('config');
const fs = require('fs');

const logger = require('../common/logger');

const CERT_KEY = config.get('certificate.pathToKey');
const CERT = config.get('certificate.pathToCert');

if (!fs.existsSync(CERT_KEY) || !fs.existsSync(CERT)) {
    if (!fs.existsSync(CERT)) {
        logger.error('Cannot get access to your certificate');
    }
    if (!fs.existsSync(CERT_KEY)) {
        logger.error('Cannot get access to your certificate key');
    }
    logger.error('Please verify that file exists and path to file in env config was configured correctly');
    process.exit();
}

if (config.get('telegramAPI.botToken') === 'api_token') {
    logger.error('You have to set up TELEGRAM_API_TOKEN in env config');
    process.exit();
}
