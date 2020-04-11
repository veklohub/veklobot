
jest.mock('cron', () => ({
    CronJob: jest.fn().mockImplementation((pattern, callback) => ({
        start: jest.fn(() => {
            console.log(pattern);
            return callback();
        })
    }))
}));
jest.mock('../../src/common/logger', () => ({
    info: () => {},
    error: () => {}
}));
jest.mock('../../src/controllers/exchangeRate', () => ({
    getUSDRate: jest.fn()
}));

const sut = require('../../src/controllers/jobs');

const cron = require('cron');

const logger = require('../../src/common/logger');
const jobHandlersList = require('../../src/consts/jobHandlers');
const exchangeRate = require('../../src/controllers/exchangeRate');

describe('jobs controller', function() {

    describe('addJob method', () => {

        let loggernErrorSpy;
        let cronJobSpy;
        let getUSDRateSpy;

        beforeAll(() => {
            loggernErrorSpy = jest.spyOn(logger, 'error');
            cronJobSpy = jest.spyOn(cron, 'CronJob');
            getUSDRateSpy = jest.spyOn(exchangeRate, 'getUSDRate');
        });

        afterAll(() => {
            loggernErrorSpy.mockRestore();
            cronJobSpy.mockRestore();
        });

        describe('if call without params', () => {
            beforeAll(() => {
                sut.addJob();
            });

            afterAll(() => {
                loggernErrorSpy.mockClear();
                cronJobSpy.mockClear();
            });

            it('should write error to log', function() {
                expect(loggernErrorSpy).toHaveBeenCalledTimes(1);
            });

            it('shouldn\'t add job', function() {
                expect(cronJobSpy).not.toHaveBeenCalled();
            });
        });

        describe('if call without chatId', () => {
            beforeAll(() => {
                sut.addJob('SOME_JOB');
            });

            afterAll(() => {
                loggernErrorSpy.mockClear();
                cronJobSpy.mockClear();
            });

            it('should write error to log', function() {
                expect(loggernErrorSpy).toHaveBeenCalledTimes(1);
            });

            it('shouldn\'t add job', function() {
                expect(cronJobSpy).not.toHaveBeenCalled();
            });
        });

        describe('if call with invalid job name', () => {
            beforeAll(() => {
                sut.addJob('SOME_JOB', 'SOME_CHAT_ID');
            });

            afterAll(() => {
                loggernErrorSpy.mockClear();
                cronJobSpy.mockClear();
            });

            it('should write error to log', function() {
                expect(loggernErrorSpy).toHaveBeenCalledTimes(1);
            });

            it('shouldn\'t add job', function() {
                expect(cronJobSpy).not.toHaveBeenCalled();
            });
        });

        describe('if all params are valid', () => {
            beforeAll(() => {
                sut.addJob(jobHandlersList.USD_RATE, 'SOME_CHAT_ID');
            });

            afterAll(() => {
                loggernErrorSpy.mockClear();
                cronJobSpy.mockClear();
            });

            it('should add job', function() {
                expect(cronJobSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe('if called second time with the same params', () => {
            beforeAll(() => {
                sut.addJob(jobHandlersList.USD_RATE, 'SOME_CHAT_ID');
            });

            afterAll(() => {
                loggernErrorSpy.mockClear();
                cronJobSpy.mockClear();
            });

            it('should add job', function() {
                expect(cronJobSpy).not.toHaveBeenCalled();
            });

            it('should get USd rate', function() {
                expect(getUSDRateSpy).toHaveBeenCalledTimes(1);
            });
        });
    });
});
