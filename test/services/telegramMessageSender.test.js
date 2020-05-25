
let mockedResponse = {result: 'ok'};

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
                    return callback(undefined, undefined, JSON.stringify(mockedResponse));
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
                expect(CALLBACK_MOCK).toHaveBeenCalledWith(undefined, mockedResponse);
            });
        });

        describe('negative case', () => {
            const MOCKED_ERROR = new Error('Some error');

            beforeAll(() => {
                mockedResponse = 'Some error';
                requestPostSpy.mockClear();
                createReadStreamSpy.mockClear();
                request.post.mockImplementation((config, callback) => {
                    return callback(MOCKED_ERROR, undefined, mockedResponse);
                });
                sut.setWebhook(SERVER_URL, PATH_TO_CERT, CALLBACK_MOCK);
            });

            it('should call callback with expected arguments', function() {
                expect(CALLBACK_MOCK).toHaveBeenCalledWith(MOCKED_ERROR, mockedResponse);
            });
        });
    });

    describe('getWebhookInfo', () => {
        const CALLBACK_MOCK = jest.fn();

        describe('positive case', () => {
            beforeAll(() => {
                mockedResponse = {
                    result: {
                        last_error_date: 1590425808,
                        url: 'https://your.domain:443/1234567890:ABCDefghIGKLmnopQRSTuvwxYZ123456789'
                    }
                };
                requestPostSpy.mockClear();
                CALLBACK_MOCK.mockClear();
                request.post.mockImplementation((config, callback) => {
                    return callback(undefined, undefined, JSON.stringify(mockedResponse));
                });
                sut.getWebhookInfo(CALLBACK_MOCK);
            });

            it('should send post request with correct params', function () {
                expect(requestPostSpy).toHaveBeenCalledWith({
                    url: 'some.api/SOME_TOKEN/getWebhookInfo',
                    strictSSL: false
                }, expect.any(Function));
            });

            it('should call callback with expected arguments', function () {
                expect(CALLBACK_MOCK).toHaveBeenCalledWith(undefined, {
                    result: {
                        last_error_date: '25-05-2020, 16:56:48',
                        url: 'https://your.domain:443/YOUR_TELEGRAM_BOT_TOKEN'
                    }
                });
            });
        });

        describe('webhook response in string', () => {
            beforeAll(() => {
                mockedResponse = 'Some error';
                requestPostSpy.mockClear();
                CALLBACK_MOCK.mockClear();
                request.post.mockImplementation((config, callback) => {
                    return callback(undefined, undefined, mockedResponse);
                });
                sut.getWebhookInfo(CALLBACK_MOCK);
            });

            it('should call callback with expected arguments', function () {
                expect(CALLBACK_MOCK).toHaveBeenCalledWith(undefined, mockedResponse);
            });
        });

        describe('no last_error_date param in webhook response', () => {
            beforeAll(() => {
                mockedResponse = {
                    result: { last_error_date: undefined }
                };
                requestPostSpy.mockClear();
                CALLBACK_MOCK.mockClear();
                request.post.mockImplementation((config, callback) => {
                    return callback(undefined, undefined, mockedResponse);
                });
                sut.getWebhookInfo(CALLBACK_MOCK);
            });

            it('should call callback with expected arguments', function () {
                expect(CALLBACK_MOCK).toHaveBeenCalledWith(undefined, mockedResponse);
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
                return callback(undefined, undefined, JSON.stringify(mockedResponse));
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
            expect(CALLBACK_MOCK).toHaveBeenCalledWith(undefined, JSON.stringify(mockedResponse));
        });
    });
});
