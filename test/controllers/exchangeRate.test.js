
jest.mock('../../src/common/logger', () => ({
    info: () => {},
    error: () => {}
}));
jest.mock('../../src/services/telegramMessageSender', () => ({
    sendMessage: jest.fn()
}));
jest.mock('../../src/services/exchangeRateGetter', () => ({
    getNBUExchangeRate: jest.fn()
}));

jest.useFakeTimers();

const sut = require('../../src/controllers/exchangeRate');

const logger = require('../../src/common/logger');
const exchangeRateGetter = require('../../src/services/exchangeRateGetter');
const telegramMessageSender = require('../../src/services/telegramMessageSender');

describe('exchangeRate controller', function() {

    describe('getUSDRate method', () => {

        let loggernErrorSpy;
        let loggerInfoSpy;
        let getNBUExchangeRateSpy;
        let sendMessageSpy;

        beforeAll(() => {
            loggernErrorSpy = jest.spyOn(logger, 'error');
            loggerInfoSpy = jest.spyOn(logger, 'info');
            getNBUExchangeRateSpy = jest.spyOn(exchangeRateGetter, 'getNBUExchangeRate');
            sendMessageSpy = jest.spyOn(telegramMessageSender, 'sendMessage');
        });

        afterAll(() => {
            loggernErrorSpy.mockRestore();
            loggerInfoSpy.mockRestore();
            getNBUExchangeRateSpy.mockRestore();
            sendMessageSpy.mockRestore();
        });

        describe('if call without chatId', () => {
            beforeAll(() => {
                loggernErrorSpy.mockClear();
                getNBUExchangeRateSpy.mockClear();
                sendMessageSpy.mockClear();
                sut.getUSDRate();
            });

            it('should write error to log', function() {
                expect(loggernErrorSpy).toHaveBeenCalledTimes(1);
            });

            it('shouldn\'t call NBU API error to log', function() {
                expect(getNBUExchangeRateSpy).not.toHaveBeenCalled();
            });

            it('shouldn\'t send message to telegram API', function() {
                expect(sendMessageSpy).not.toHaveBeenCalled();
            });
        });

        describe('if NBU  API returns correct result', () => {

            beforeAll(() => {
                getNBUExchangeRateSpy.mockClear();
                sendMessageSpy.mockClear();
                exchangeRateGetter.getNBUExchangeRate.mockImplementationOnce((callback) => {
                    callback(undefined, [{
                        cc: 'USD',
                        rate: 25
                    }]);
                });
                sut.getUSDRate('SOME_CHAT_ID');
            });

            it('should call NBU API', function() {
                expect(getNBUExchangeRateSpy).toHaveBeenCalledTimes(1);
            });

            it('should send message to telegram API', function() {
                expect(sendMessageSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe('if NBU  API returns empty response without error and result', () => {

            beforeAll(() => {
                getNBUExchangeRateSpy.mockClear();
                sendMessageSpy.mockClear();
                exchangeRateGetter.getNBUExchangeRate.mockImplementationOnce((callback) => {
                    callback();
                });
                sut.getUSDRate('SOME_CHAT_ID');
            });

            it('should call NBU API', function() {
                expect(getNBUExchangeRateSpy).toHaveBeenCalledTimes(1);
            });

            it('should send message to telegram API', function() {
                expect(sendMessageSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe('if NBU  API returns error first time and correct result second time', () => {

            beforeAll(() => {
                getNBUExchangeRateSpy.mockClear();
                sendMessageSpy.mockClear();
                exchangeRateGetter.getNBUExchangeRate.mockImplementationOnce((callback) => {
                    callback('SOME_ERROR');
                });
                exchangeRateGetter.getNBUExchangeRate.mockImplementation((callback) => {
                    callback(undefined, [{
                        cc: 'USD',
                        rate: 25
                    }]);
                });
                sut.getUSDRate('SOME_CHAT_ID');
                jest.runAllTimers();
            });

            it('should call NBU API twice', function() {
                expect(getNBUExchangeRateSpy).toHaveBeenCalledTimes(2);
            });

            it('should send message to telegram API', function() {
                expect(sendMessageSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe('if NBU  API returns error each time', () => {

            beforeAll(() => {
                getNBUExchangeRateSpy.mockClear();
                sendMessageSpy.mockClear();
                exchangeRateGetter.getNBUExchangeRate.mockImplementation((callback) => {
                    callback('SOME_ERROR');
                });
                sut.getUSDRate('SOME_CHAT_ID');
                jest.runAllTimers();
            });

            it('should call NBU API twice', function() {
                expect(getNBUExchangeRateSpy).toHaveBeenCalledTimes(4);
            });

            it('should send message to telegram API', function() {
                expect(sendMessageSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe('if telegram API responses with error', () => {

            beforeAll(() => {
                loggernErrorSpy.mockClear();
                exchangeRateGetter.getNBUExchangeRate.mockImplementationOnce((callback) => {
                    callback(undefined, [{
                        cc: 'USD',
                        rate: 25
                    }]);
                });
                telegramMessageSender.sendMessage.mockImplementation((chatId, text, callback) => {
                    callback('SOME_ERROR');
                });
                sut.getUSDRate('SOME_CHAT_ID');
            });

            it('should write error to log', function() {
                expect(loggernErrorSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe('if telegram API responses with bad result', () => {

            beforeAll(() => {
                loggernErrorSpy.mockClear();
                exchangeRateGetter.getNBUExchangeRate.mockImplementationOnce((callback) => {
                    callback(undefined, [{
                        cc: 'USD',
                        rate: 25
                    }]);
                });
                telegramMessageSender.sendMessage.mockImplementation((chatId, text, callback) => {
                    callback(undefined, {
                        ok: false,
                        message: 'Something went wrong'
                    });
                });
                sut.getUSDRate('SOME_CHAT_ID');
            });

            it('should write error to log', function() {
                expect(loggernErrorSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe('if telegram API sends message successfully', () => {

            beforeAll(() => {
                loggerInfoSpy.mockClear();
                exchangeRateGetter.getNBUExchangeRate.mockImplementationOnce((callback) => {
                    callback(undefined, [{
                        cc: 'USD',
                        rate: 25
                    }]);
                });
                telegramMessageSender.sendMessage.mockImplementation((chatId, text, callback) => {
                    callback(undefined, { ok: true });
                });
                sut.getUSDRate('SOME_CHAT_ID');
            });

            it('should write info to log twice', function() {
                expect(loggerInfoSpy).toHaveBeenCalledTimes(2);
            });
        });
    });
});
