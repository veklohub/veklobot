const request = require('request');

const dictionary = require('../dictionary');

const getNBUExchangeRate = (callback) => {
    console.log(dictionary.EXCHANGE_RATE_API);
    request(dictionary.EXCHANGE_RATE_API, function(error, response, body) {
        callback(error, body ? JSON.parse(body) : body);
    });
};

module.exports = {
    getNBUExchangeRate
};
