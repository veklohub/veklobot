
jest.mock('cron', () => ({
    CronJob: jest.fn().mockImplementation((pattern, callback) => ({
        start: jest.fn(() => {
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
                loggernErrorSpy.mockClear();
                cronJobSpy.mockClear();
                sut.addJob();
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
                loggernErrorSpy.mockClear();
                cronJobSpy.mockClear();
                sut.addJob('SOME_JOB');
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
                loggernErrorSpy.mockClear();
                cronJobSpy.mockClear();
                sut.addJob('SOME_JOB', 'SOME_CHAT_ID');
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
                loggernErrorSpy.mockClear();
                cronJobSpy.mockClear();
                sut.addJob(jobHandlersList.USD_RATE, 'SOME_CHAT_ID');
            });

            it('should add job', function() {
                expect(cronJobSpy).toHaveBeenCalledTimes(1);
            });

            it('should get USd rate', function() {
                expect(getUSDRateSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe('if called second time with the same params', () => {
            beforeAll(() => {
                loggernErrorSpy.mockClear();
                cronJobSpy.mockClear();
                sut.addJob(jobHandlersList.USD_RATE, 'SOME_CHAT_ID');
            });

            it('shouldn\'t add job', function() {
                expect(cronJobSpy).not.toHaveBeenCalled();
            });

            it('should get USd rate', function() {
                expect(getUSDRateSpy).toHaveBeenCalledTimes(1);
            });
        });
    });
});
