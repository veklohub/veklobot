
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
            sut();
        });

        afterAll(() => {
            loggernWarnSpy.mockClear();
            getUSDRateSpy.mockClear();
            addJobSpy.mockClear();
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
            sut({});
        });

        afterAll(() => {
            loggernWarnSpy.mockClear();
            getUSDRateSpy.mockClear();
            addJobSpy.mockClear();
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
            sut({
                text: 'SOME_TEXT',
                from: {}
            });
        });

        afterAll(() => {
            loggernWarnSpy.mockClear();
            getUSDRateSpy.mockClear();
            addJobSpy.mockClear();
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
            sut({
                text: 'SOME_TEXT',
                from: {
                    is_bot: false
                },
                chat: {}
            });
        });

        afterAll(() => {
            loggernWarnSpy.mockClear();
            getUSDRateSpy.mockClear();
            addJobSpy.mockClear();
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
            sut({
                from: {
                    is_bot: false
                },
                chat: {
                    id: 'SOME_ID'
                }
            });
        });

        afterAll(() => {
            loggernWarnSpy.mockClear();
            getUSDRateSpy.mockClear();
            addJobSpy.mockClear();
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
            sut({
                text: commands.DOLLAR_RATE,
                chat: {
                    id: 'SOME_ID'
                }
            });
        });

        afterAll(() => {
            loggernWarnSpy.mockClear();
            getUSDRateSpy.mockClear();
            addJobSpy.mockClear();
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

        afterAll(() => {
            loggernWarnSpy.mockClear();
            getUSDRateSpy.mockClear();
            addJobSpy.mockClear();
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

        afterAll(() => {
            loggernWarnSpy.mockClear();
            getUSDRateSpy.mockClear();
            addJobSpy.mockClear();
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

        afterAll(() => {
            loggernWarnSpy.mockClear();
            getUSDRateSpy.mockClear();
            addJobSpy.mockClear();
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
