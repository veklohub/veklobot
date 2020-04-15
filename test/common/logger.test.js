
jest.mock('winston', () => ({
    createLogger: jest.fn(() => ({
        add: jest.fn()
    })),
    format: {
        combine: jest.fn(),
        timestamp: jest.fn(),
        prettyPrint: jest.fn(),
        simple: jest.fn()
    },
    transports: {
        File: jest.fn(),
        Console: jest.fn()
    }
}));
jest.mock('config', () => ({
    util: {
        getEnv: jest.fn()
    }
}));

const winston = require('winston');

describe('logger', function() {

    let sut;
    let createLoggerSpy;

    beforeAll(() => {
        createLoggerSpy = jest.spyOn(winston, 'createLogger');
    });

    afterAll(() => {
        createLoggerSpy.mockRestore();
    });

    describe('when file required', () => {
        beforeAll(() => {
            createLoggerSpy.mockClear();
            sut = require('../../src/common/logger');
        });

        it('should create logger', function() {
            expect(createLoggerSpy).toHaveBeenCalledTimes(1);
        });
    });
});
