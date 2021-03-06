
jest.mock('../../src/common/logger', () => ({
    warn: () => {}
}));
jest.mock('../../src/controllers/exchangeRate', () => ({
    getUSDRate: () => {}
}));
jest.mock('../../src/controllers/jobs', () => ({
    addJob: () => {},
    isJobExists: jest.fn()
}));
jest.mock('../../src/services/telegramMessageSender', () => ({
    sendMessage: () => {},
    answerCallbackQuery: () => {}
}));

const sut = require('../../src/controllers/messageHandler');

const commands = require('../../src/consts/commands');
const logger = require('../../src/common/logger');
const exchangeRate = require('../../src/controllers/exchangeRate');
const jobs = require('../../src/controllers/jobs');
const telegramMessageSender = require('../../src/services/telegramMessageSender');

describe('messageHandler controller', function() {

    let loggernWarnSpy;
    let sendMessageSpy;
    let answerCallbackQuerySpy;
    let getUSDRateSpy;
    let addJobSpy;

    const CHAT_ID = 'SOME_ID';

    beforeAll(() => {
        loggernWarnSpy = jest.spyOn(logger, 'warn');
        sendMessageSpy = jest.spyOn(telegramMessageSender, 'sendMessage');
        answerCallbackQuerySpy = jest.spyOn(telegramMessageSender, 'answerCallbackQuery');
        getUSDRateSpy = jest.spyOn(exchangeRate, 'getUSDRate');
        addJobSpy = jest.spyOn(jobs, 'addJob');
    });

    afterAll(() => {
        loggernWarnSpy.mockRestore();
        sendMessageSpy.mockRestore();
        answerCallbackQuerySpy.mockRestore();
        getUSDRateSpy.mockRestore();
        addJobSpy.mockRestore();
    });
    
    describe('if message is undefined', () => {
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

    describe('if message is empty', () => {
        beforeAll(() => {
            loggernWarnSpy.mockClear();
            getUSDRateSpy.mockClear();
            addJobSpy.mockClear();
            sut({ message: {} });
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
                message: {
                    text: 'SOME_TEXT',
                    from: {
                        is_bot: false
                    },
                    chat: {}
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

    describe('if message is without text', () => {
        beforeAll(() => {
            loggernWarnSpy.mockClear();
            getUSDRateSpy.mockClear();
            addJobSpy.mockClear();
            sut({
                message: {
                    from: {
                        is_bot: false
                    },
                    chat: {
                        id: CHAT_ID
                    }
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
                message: {
                    text: commands.DOLLAR_RATE,
                    chat: {
                        id: CHAT_ID
                    }
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
                message: {
                    text: commands.DOLLAR_RATE,
                    from: {
                        is_bot: true
                    },
                    chat: {
                        id: CHAT_ID
                    }
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
                message: {
                    text: 'SOME_TEXT',
                    from: {
                        is_bot: false
                    },
                    chat: {
                        id: CHAT_ID
                    }
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

    describe('if text is /start', () => {
        beforeAll(() => {
            loggernWarnSpy.mockClear();
            sendMessageSpy.mockClear();
            answerCallbackQuerySpy.mockClear();
            sut({
                callback_query: {
                    data: commands.START.command,
                    message: {
                        chat: {
                            id: CHAT_ID
                        }
                    },
                    from: {}
                }
            });
        });

        it('shouldn\'t write warn to log', function() {
            expect(loggernWarnSpy).not.toHaveBeenCalled();
        });

        it('should answer to callback query', function() {
            expect(answerCallbackQuerySpy).toHaveBeenCalledTimes(1);
        });

        it('should send message', function() {
            expect(sendMessageSpy).toHaveBeenCalledWith({
                chatId: CHAT_ID,
                message: expect.any(String),
                inlineKeyboard: [[{
                    text: commands.DOLLAR_RATE.description,
                    callback_data: commands.DOLLAR_RATE.command
                }]]
            });
        });
    });

    describe('if text is /dollar_rate', () => {
        beforeAll(() => {
            loggernWarnSpy.mockClear();
            getUSDRateSpy.mockClear();
            addJobSpy.mockClear();
            sut({
                message: {
                    text: commands.DOLLAR_RATE.command,
                    from: {
                        is_bot: false
                    },
                    chat: {
                        id: CHAT_ID
                    }
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

    describe('if /dollar_rate job already exists', () => {
        beforeAll(() => {
            addJobSpy.mockClear();
            jobs.isJobExists.mockImplementation(() => true);
            sut({
                message: {
                    text: commands.DOLLAR_RATE.command,
                    from: {
                        is_bot: false
                    },
                    chat: {
                        id: CHAT_ID
                    }
                }
            });
        });

        it('should set up USD rate job only once', function() {
            expect(addJobSpy).not.toHaveBeenCalled();
        });
    });
});
