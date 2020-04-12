
const sut = require('../../src/services/dates');

const RealDate = Date;

describe('dates service', function() {
    describe('getDateForNbuApi', () => {
        beforeAll(() => {
            global.Date.now = jest.fn(() => new Date('2020-04-11T10:20:30Z').getTime());
        });

        afterAll(() => {
            global.Date = RealDate;
        });

        it('should return correct format', function() {
            expect(sut.getDateForNbuApi()).toBe('20200411');
        });
    });
});
