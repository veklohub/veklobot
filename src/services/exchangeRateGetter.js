const request = require('request');
const config = require('config');

const { getDateForNbuApi } = require('./dates');

const getNBUExchangeRate = (callback) => {
    // TODO: check if I can use endpoint without current date
    request(
        config.get('exchangeRate.nbuApi').replace('CURRENT_DATE', getDateForNbuApi()),
        function(error, response, body) {
            callback(error, body ? JSON.parse(body) : body);
        });
};

module.exports = {
    getNBUExchangeRate
};
