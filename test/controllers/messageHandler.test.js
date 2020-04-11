
jest.mock('../../src/common/logger', () => {
    return {
        warn: () => {}
    };
});
jest.mock('../../src/controllers/exchangeRate', () => {
    return {
        getUSDRate: () => {}
    };
});
jest.mock('../../src/controllers/jobs', () => {
    return {
        addJob: () => {}
    };
});

const messageHandler = require('../../src/controllers/messageHandler');
const commands = require('../../src/consts/commands');

// requires of exchangeRateGetter
const logger = require('../../src/common/logger');
const exchangeRate = require('../../src/controllers/exchangeRate');
const jobs = require('../../src/controllers/jobs');

describe('messageHandler', function() {

    let loggernWarnSpy;
    let getUSDRateSpy;
    let addJobSpy;
    
    describe('if message is undefined', () => {
        beforeAll(() => {
            loggernWarnSpy = jest.spyOn(logger, 'warn');
            getUSDRateSpy = jest.spyOn(exchangeRate, 'getUSDRate');
            addJobSpy = jest.spyOn(jobs, 'addJob');
            messageHandler();
        });

        afterAll(() => {
            loggernWarnSpy.mockRestore();
            getUSDRateSpy.mockRestore();
            addJobSpy.mockRestore();
        });
        
        it('should write warn to log', function() {
            expect(loggernWarnSpy).toHaveBeenCalledTimes(1);
        });

        it('shouldn\'t get USD rate', function() {
            expect(getUSDRateSpy).not.toHaveBeenCalled();
        });

        it('shouldn\'t set up USD rate job', function() {
            expect(addJobSpy).not.toHaveBeenCalled();
        });
    });

    describe('if message is empty', () => {
        beforeAll(() => {
            loggernWarnSpy = jest.spyOn(logger, 'warn');
            getUSDRateSpy = jest.spyOn(exchangeRate, 'getUSDRate');
            addJobSpy = jest.spyOn(jobs, 'addJob');
            messageHandler({});
        });

        afterAll(() => {
            loggernWarnSpy.mockRestore();
            getUSDRateSpy.mockRestore();
            addJobSpy.mockRestore();
        });

        it('should write warn to log', function() {
            expect(loggernWarnSpy).toHaveBeenCalledTimes(1);
        });

        it('shouldn\'t get USD rate', function() {
            expect(getUSDRateSpy).not.toHaveBeenCalled();
        });

        it('shouldn\'t set up USD rate job', function() {
            expect(addJobSpy).not.toHaveBeenCalled();
        });
    });

    describe('if message is without chat object', () => {
        beforeAll(() => {
            loggernWarnSpy = jest.spyOn(logger, 'warn');
            getUSDRateSpy = jest.spyOn(exchangeRate, 'getUSDRate');
            addJobSpy = jest.spyOn(jobs, 'addJob');
            messageHandler({
                text: 'SOME_TEXT',
                from: {}
            });
        });

        afterAll(() => {
            loggernWarnSpy.mockRestore();
            getUSDRateSpy.mockRestore();
            addJobSpy.mockRestore();
        });

        it('should write warn to log', function() {
            expect(loggernWarnSpy).toHaveBeenCalledTimes(1);
        });

        it('shouldn\'t get USD rate', function() {
            expect(getUSDRateSpy).not.toHaveBeenCalled();
        });

        it('shouldn\'t set up USD rate job', function() {
            expect(addJobSpy).not.toHaveBeenCalled();
        });
    });

    describe('if message is without chat id', () => {
        beforeAll(() => {
            loggernWarnSpy = jest.spyOn(logger, 'warn');
            getUSDRateSpy = jest.spyOn(exchangeRate, 'getUSDRate');
            addJobSpy = jest.spyOn(jobs, 'addJob');
            messageHandler({
                text: 'SOME_TEXT',
                from: {
                    is_bot: false
                },
                chat: {}
            });
        });

        afterAll(() => {
            loggernWarnSpy.mockRestore();
            getUSDRateSpy.mockRestore();
            addJobSpy.mockRestore();
        });

        it('should write warn to log', function() {
            expect(loggernWarnSpy).toHaveBeenCalledTimes(1);
        });

        it('shouldn\'t get USD rate', function() {
            expect(getUSDRateSpy).not.toHaveBeenCalled();
        });

        it('shouldn\'t set up USD rate job', function() {
            expect(addJobSpy).not.toHaveBeenCalled();
        });
    });

    describe('if message is without text', () => {
        beforeAll(() => {
            loggernWarnSpy = jest.spyOn(logger, 'warn');
            getUSDRateSpy = jest.spyOn(exchangeRate, 'getUSDRate');
            addJobSpy = jest.spyOn(jobs, 'addJob');
            messageHandler({
                from: {
                    is_bot: false
                },
                chat: {
                    id: 'SOME_ID'
                }
            });
        });

        afterAll(() => {
            loggernWarnSpy.mockRestore();
            getUSDRateSpy.mockRestore();
            addJobSpy.mockRestore();
        });

        it('should write warn to log', function() {
            expect(loggernWarnSpy).toHaveBeenCalledTimes(1);
        });

        it('shouldn\'t get USD rate', function() {
            expect(getUSDRateSpy).not.toHaveBeenCalled();
        });

        it('shouldn\'t set up USD rate job', function() {
            expect(addJobSpy).not.toHaveBeenCalled();
        });
    });

    describe('if message is without from object', () => {
        beforeAll(() => {
            loggernWarnSpy = jest.spyOn(logger, 'warn');
            getUSDRateSpy = jest.spyOn(exchangeRate, 'getUSDRate');
            addJobSpy = jest.spyOn(jobs, 'addJob');
            messageHandler({
                text: commands.DOLLAR_RATE,
                chat: {
                    id: 'SOME_ID'
                }
            });
        });

        afterAll(() => {
            loggernWarnSpy.mockRestore();
            getUSDRateSpy.mockRestore();
            addJobSpy.mockRestore();
        });

        it('should write warn to log', function() {
            expect(loggernWarnSpy).toHaveBeenCalledTimes(1);
        });

        it('shouldn\'t get USD rate', function() {
            expect(getUSDRateSpy).not.toHaveBeenCalled();
        });

        it('shouldn\'t set up USD rate job', function() {
            expect(addJobSpy).not.toHaveBeenCalled();
        });
    });

    describe('if message is from bot', () => {
        beforeAll(() => {
            loggernWarnSpy = jest.spyOn(logger, 'warn');
            getUSDRateSpy = jest.spyOn(exchangeRate, 'getUSDRate');
            addJobSpy = jest.spyOn(jobs, 'addJob');
            messageHandler({
                text: commands.DOLLAR_RATE,
                from: {
                    is_bot: true
                },
                chat: {
                    id: 'SOME_ID'
                }
            });
        });

        afterAll(() => {
            loggernWarnSpy.mockRestore();
            getUSDRateSpy.mockRestore();
            addJobSpy.mockRestore();
        });

        it('should write warn to log', function() {
            expect(loggernWarnSpy).toHaveBeenCalledTimes(1);
        });

        it('shouldn\'t get USD rate', function() {
            expect(getUSDRateSpy).not.toHaveBeenCalled();
        });

        it('shouldn\'t set up USD rate job', function() {
            expect(addJobSpy).not.toHaveBeenCalled();
        });
    });

    describe('if text is SOME_TEXT', () => {
        beforeAll(() => {
            loggernWarnSpy = jest.spyOn(logger, 'warn');
            getUSDRateSpy = jest.spyOn(exchangeRate, 'getUSDRate');
            addJobSpy = jest.spyOn(jobs, 'addJob');
            messageHandler({
                text: 'SOME_TEXT',
                from: {
                    is_bot: false
                },
                chat: {
                    id: 'SOME_ID'
                }
            });
        });

        afterAll(() => {
            loggernWarnSpy.mockRestore();
            getUSDRateSpy.mockRestore();
            addJobSpy.mockRestore();
        });

        it('shouldn\'t write warn to log', function() {
            expect(loggernWarnSpy).not.toHaveBeenCalled();
        });

        it('shouldn\'t get USD rate', function() {
            expect(getUSDRateSpy).not.toHaveBeenCalled();
        });

        it('shouldn\'t set up USD rate job', function() {
            expect(addJobSpy).not.toHaveBeenCalled();
        });
    });

    describe('if text is /dollar_rate', () => {
        beforeAll(() => {
            loggernWarnSpy = jest.spyOn(logger, 'warn');
            getUSDRateSpy = jest.spyOn(exchangeRate, 'getUSDRate');
            addJobSpy = jest.spyOn(jobs, 'addJob');
            messageHandler({
                text: commands.DOLLAR_RATE,
                from: {
                    is_bot: false
                },
                chat: {
                    id: 'SOME_ID'
                }
            });
        });

        afterAll(() => {
            loggernWarnSpy.mockRestore();
            getUSDRateSpy.mockRestore();
            addJobSpy.mockRestore();
        });

        it('shouldn\'t write warn to log', function() {
            expect(loggernWarnSpy).not.toHaveBeenCalled();
        });

        it('should get USD rate', function() {
            expect(getUSDRateSpy).toHaveBeenCalledTimes(1);
        });

        it('should set up USD rate job', function() {
            expect(addJobSpy).toHaveBeenCalledTimes(1);
        });
    });
});
