const fs = require('fs');
const request = require('request');
const config = require('config');
const moment = require('moment');

const { hideTelegramBotToken } = require('./strings');

const TELEGRAM_API_URL = `${config.get('telegram.apiUrl')}${config.get('telegram.botToken')}/`;

const setWebhook = (serverURLForWebhook, pathToCert, callback) => {
    request.post({
        url: `${TELEGRAM_API_URL}setWebhook`,
        strictSSL: false,
        formData: {
            url: serverURLForWebhook,
            certificate: fs.createReadStream(pathToCert)
        }
    }, function(error, response, body) {
        let parsedBody = body;
        try {
            parsedBody = JSON.parse(body);
        } catch(error) {
            parsedBody = body;
        } finally {
            callback(error, parsedBody);
        }
    });
};

const getWebhookInfo = (callback) => {
    request.post({
        url: `${TELEGRAM_API_URL}getWebhookInfo`,
        strictSSL: false
    }, function(error, response, body) {
        let parsedBody = body;
        try {
            parsedBody = JSON.parse(body);
        } catch(error) {
            parsedBody = body;
        } finally {
            if (parsedBody && parsedBody.result) {
                if (Number.isInteger(parsedBody.result.last_error_date)) {
                    parsedBody.result.last_error_date = moment.unix(parsedBody.result.last_error_date).format();
                }

                if (parsedBody.result.url) {
                    parsedBody.result.url = hideTelegramBotToken(parsedBody.result.url);
                }
            }

            callback(error, parsedBody);
        }
    });
};

const sendMessage = (chatId, message, callback) => {
    request.post({
        url: `${TELEGRAM_API_URL}sendMessage`,
        strictSSL: false,
        json: {
            chat_id: chatId,
            text: message
        }
    }, function(error, response, body) {
        callback(error, body);
    });
};

module.exports = {
    setWebhook,
    getWebhookInfo,
    sendMessage
};
