
jest.mock('../../src/common/logger', () => ({
    warn: () => {}
}));
jest.mock('../../src/controllers/exchangeRate', () => ({
    getUSDRate: () => {}
}));
jest.mock('../../src/controllers/jobs', () => ({
    addJob: () => {}
}));

const sut = require('../../src/controllers/messageHandler');

const commands = require('../../src/consts/commands');
const logger = require('../../src/common/logger');
const exchangeRate = require('../../src/controllers/exchangeRate');
const jobs = require('../../src/controllers/jobs');

describe('messageHandler controller', function() {

    let loggernWarnSpy;
    let getUSDRateSpy;
    let addJobSpy;

    beforeAll(() => {
        loggernWarnSpy = jest.spyOn(logger, 'warn');
        getUSDRateSpy = jest.spyOn(exchangeRate, 'getUSDRate');
        addJobSpy = jest.spyOn(jobs, 'addJob');
    });

    afterAll(() => {
        loggernWarnSpy.mockRestore();
        getUSDRateSpy.mockRestore();
        addJobSpy.mockRestore();
    });
    
    describe('if message is undefined', () => {
        beforeAll(() => {
            loggernWarnSpy.mockClear();
            getUSDRateSpy.mockClear();
            addJobSpy.mockClear();
            sut();
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
            loggernWarnSpy.mockClear();
            getUSDRateSpy.mockClear();
            addJobSpy.mockClear();
            sut({});
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
            loggernWarnSpy.mockClear();
            getUSDRateSpy.mockClear();
            addJobSpy.mockClear();
            sut({
                text: 'SOME_TEXT',
                from: {}
            });
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
            loggernWarnSpy.mockClear();
            getUSDRateSpy.mockClear();
            addJobSpy.mockClear();
            sut({
                text: 'SOME_TEXT',
                from: {
                    is_bot: false
                },
                chat: {}
            });
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
            loggernWarnSpy.mockClear();
            getUSDRateSpy.mockClear();
            addJobSpy.mockClear();
            sut({
                from: {
                    is_bot: false
                },
                chat: {
                    id: 'SOME_ID'
                }
            });
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
            loggernWarnSpy.mockClear();
            getUSDRateSpy.mockClear();
            addJobSpy.mockClear();
            sut({
                text: commands.DOLLAR_RATE,
                chat: {
                    id: 'SOME_ID'
                }
            });
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
            loggernWarnSpy.mockClear();
            getUSDRateSpy.mockClear();
            addJobSpy.mockClear();
            sut({
                text: commands.DOLLAR_RATE,
                from: {
                    is_bot: true
                },
                chat: {
                    id: 'SOME_ID'
                }
            });
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
            loggernWarnSpy.mockClear();
            getUSDRateSpy.mockClear();
            addJobSpy.mockClear();
            sut({
                text: 'SOME_TEXT',
                from: {
                    is_bot: false
                },
                chat: {
                    id: 'SOME_ID'
                }
            });
        });

        it('shouldn write warn to log', function() {
            expect(loggernWarnSpy).toHaveBeenCalledTimes(1);
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
            loggernWarnSpy.mockClear();
            getUSDRateSpy.mockClear();
            addJobSpy.mockClear();
            sut({
                text: commands.DOLLAR_RATE,
                from: {
                    is_bot: false
                },
                chat: {
                    id: 'SOME_ID'
                }
            });
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
