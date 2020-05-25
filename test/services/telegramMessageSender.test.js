
const MOCKED_RESPONSE = {result: 'ok'};

jest.mock('fs', () => ({
    createReadStream: jest.fn(() => 'anything')
}));
jest.mock('request', () => ({
    post: jest.fn()
}));
jest.mock('config', () => ({
    get: jest.fn((path) => {
        switch (path) {
            case 'telegram.apiUrl':
                return 'some.api/';
            case 'telegram.botToken':
                return 'SOME_TOKEN';
        }
    })
}));

const sut = require('../../src/services/telegramMessageSender');

const request = require('request');
const fs = require('fs');

describe('telegramMessageSender service', function() {

    let requestPostSpy;
    let createReadStreamSpy;

    beforeAll(() => {
        requestPostSpy = jest.spyOn(request, 'post');
        createReadStreamSpy = jest.spyOn(fs, 'createReadStream');
    });

    afterAll(() => {
        requestPostSpy.mockRestore();
        createReadStreamSpy.mockRestore();
    });

    describe('setWebhook', () => {
        const SERVER_URL = 'server.url/';
        const PATH_TO_CERT = 'path/to/cert/';
        const CALLBACK_MOCK = jest.fn();

        describe('positive case', () => {

            beforeAll(() => {
                requestPostSpy.mockClear();
                createReadStreamSpy.mockClear();
                request.post.mockImplementation((config, callback) => {
                    return callback(undefined, undefined, JSON.stringify(MOCKED_RESPONSE));
                });
                sut.setWebhook(SERVER_URL, PATH_TO_CERT, CALLBACK_MOCK);
            });

            it('should send post request with correct params', function() {
                expect(requestPostSpy).toHaveBeenCalledWith({
                    url: 'some.api/SOME_TOKEN/setWebhook',
                    strictSSL: false,
                    formData: {
                        url: SERVER_URL,
                        certificate: expect.anything()
                    }
                }, expect.any(Function));
            });

            it('should read certificate from correct path', function() {
                expect(createReadStreamSpy).toHaveBeenCalledWith(PATH_TO_CERT);
            });

            it('should call callback with expected arguments', function() {
                expect(CALLBACK_MOCK).toHaveBeenCalledWith(undefined, MOCKED_RESPONSE);
            });
        });

        describe('negative case', () => {
            const MOCKED_ERROR = new Error('Some error');
            const MOCKED_RESPONSE = 'Some error';

            beforeAll(() => {
                requestPostSpy.mockClear();
                createReadStreamSpy.mockClear();
                request.post.mockImplementation((config, callback) => {
                    return callback(MOCKED_ERROR, undefined, MOCKED_RESPONSE);
                });
                sut.setWebhook(SERVER_URL, PATH_TO_CERT, CALLBACK_MOCK);
            });

            it('should call callback with expected arguments', function() {
                expect(CALLBACK_MOCK).toHaveBeenCalledWith(MOCKED_ERROR, MOCKED_RESPONSE);
            });
        });
    });

    describe('sendMessage', () => {
        const CHAT_ID = 'SOME_CHAT_ID';
        const MESSAGE = 'Some message...';
        const CALLBACK_MOCK = jest.fn();

        beforeAll(() => {
            requestPostSpy.mockClear();
            request.post.mockImplementation((config, callback) => {
                return callback(undefined, undefined, JSON.stringify(MOCKED_RESPONSE));
            });
            sut.sendMessage(CHAT_ID, MESSAGE, CALLBACK_MOCK);
        });

        it('should send post request with correct params', function() {
            expect(requestPostSpy).toHaveBeenCalledWith({
                url: 'some.api/SOME_TOKEN/sendMessage',
                strictSSL: false,
                json: {
                    chat_id: CHAT_ID,
                    text: MESSAGE
                }
            }, expect.any(Function));
        });

        it('should call callback with expected arguments', function() {
            expect(CALLBACK_MOCK).toHaveBeenCalledWith(undefined, JSON.stringify(MOCKED_RESPONSE));
        });
    });
});
