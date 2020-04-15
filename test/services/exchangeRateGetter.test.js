
jest.mock('request', () => ({
    get: jest.fn()
}));
jest.mock('config', () => ({
    get: jest.fn(() => 'some_url/CURRENT_DATE')
}));

const sut = require('../../src/services/exchangeRateGetter');

const request = require('request');

const RealDate = Date;

describe('exchangeRateGetter service', function() {

    let requestGetSpy;
    let resultCallback;

    beforeAll(() => {
        global.Date.now = jest.fn(() => new Date('2020-04-11T10:20:30Z').getTime());
        requestGetSpy = jest.spyOn(request, 'get');
        resultCallback = jest.fn();
    });

    afterAll(() => {
        global.Date = RealDate;
        requestGetSpy.mockRestore();
    });
    describe('getNBUExchangeRate', () => {

        describe('when NBU API returnes response without error', () => {
            const apiResponse = [{}];

            beforeAll(() => {
                requestGetSpy.mockClear();
                resultCallback.mockClear();
                request.get.mockImplementation((url, getCallback) => {
                    return getCallback(undefined, JSON.stringify(apiResponse), JSON.stringify(apiResponse))
                });
                sut.getNBUExchangeRate(resultCallback);
            });

            it('should send get request with correct params', function() {
                expect(requestGetSpy).toHaveBeenCalledWith('some_url/20200411', expect.any(Function));
            });

            it('should call callback with correct arguments', function() {
                expect(resultCallback).toHaveBeenCalledWith(undefined, apiResponse);
            });
        });

        describe('when NBU API returnes response without error and with empty body', () => {
            beforeAll(() => {
                requestGetSpy.mockClear();
                resultCallback.mockClear();
                request.get.mockImplementation((url, getCallback) => {
                    return getCallback();
                });
                sut.getNBUExchangeRate(resultCallback);
            });

            it('should call callback without arguments', function() {
                expect(resultCallback).toHaveBeenCalledWith(undefined, undefined);
            });
        });

        describe('when NBU API returnes response with error', () => {
            const mockedError = 'SOME_ERROR';

            beforeAll(() => {
                requestGetSpy.mockClear();
                resultCallback.mockClear();
                request.get.mockImplementation((url, getCallback) => {
                    return getCallback(mockedError);
                });
                sut.getNBUExchangeRate(resultCallback);
            });

            it('should call callback with error', function() {
                expect(resultCallback).toHaveBeenCalledWith(mockedError, undefined);
            });
        });
    });
});
