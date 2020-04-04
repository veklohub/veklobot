const request = require('request');

const logger = require('../common/logger');
const dictionary = require('../dictionary');

const getNBUExchangeRate = (callback) => {
    request(dictionary.EXCHANGE_RATE_API, function(error, response, body) {
        if (error) {
            logger.error(`NBU API ${dictionary.EXCHANGE_RATE_API} responsed with the error: ${error}`);
        }

        callback(error, body ? JSON.parse(body) : body);
    });
};

module.exports = {
    getNBUExchangeRate
};