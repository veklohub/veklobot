const envConfig = require('dotenv');
const fs = require('fs');

const PATH_TO_ENV_CONFIG = './config/.env';

process.on('uncaughtException', function (error) {
    console.log(error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

if (!fs.existsSync(PATH_TO_ENV_CONFIG)) {
    console.error('You have to create ./config/.env file. You can use ./config/.env_example file as an example of configuration');
    process.exit();
}

envConfig.config({
    path: PATH_TO_ENV_CONFIG
});

if (!process.env.TELEGRAM_API_TOKEN) {
    console.error('You have to set up TELEGRAM_API_TOKEN in your .env file');
    process.exit();
}
