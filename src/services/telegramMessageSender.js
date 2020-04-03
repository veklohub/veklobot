const fs = require('fs');
const request = require('request');

const dictionary = require('../dictionary');

const setWebhook = (serverURLForWebhook, pathToCert, callback) => {
    request.post({
        url: `${dictionary.TELEGRAM_API}setWebhook`,
        strictSSL: false,
        formData: {
            url: serverURLForWebhook,
            certificate: fs.createReadStream(pathToCert)
        },
    }, function(error, response, body) {
        callback(error, body);
    });
};

const sendMessage = (chatId, message, callback) => {
    request.post({
        url: `${dictionary.TELEGRAM_API}sendMessage`,
        strictSSL: false,
        json: {
            chat_id: chatId,
            text: message
        },
    }, function(error, response, body) {
        callback(error, body);
    });
};

module.exports = {
    setWebhook,
    sendMessage
};
