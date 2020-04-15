const moment = require('moment');

// expected format = 20200403
const getDateForNbuApi = () => moment().format('YYYYMMDD');

module.exports = {
    getDateForNbuApi
};
