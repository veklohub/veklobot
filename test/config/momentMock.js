const moment = require.requireActual('moment-timezone');
jest.doMock('moment', () => {
    moment.tz.setDefault('Etc/UTC');
    return moment;
});
