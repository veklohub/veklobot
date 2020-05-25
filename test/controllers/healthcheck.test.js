
jest.mock('../../src/common/logger', () => ({
    info: () => {}
}));
jest.mock('../../src/services/telegramMessageSender', () => ({
    getWebhookInfo: jest.fn()
}));

const sut = require('../../src/controllers/healthcheck');

const telegramMessageSender = require('../../src/services/telegramMessageSender');

describe('healthcheck controller', function() {

    describe('healthcheck', () => {

        const CALLBACK_MOCK = jest.fn();
        const MOCKED_WEBHOOK_RESPONSE = { result: {} };

        let getWebhookInfoSpy;

        beforeAll(() => {
            getWebhookInfoSpy = jest.spyOn(telegramMessageSender, 'getWebhookInfo');
            telegramMessageSender.getWebhookInfo.mockImplementation((callback) => {
                return callback(undefined, MOCKED_WEBHOOK_RESPONSE);
            });
            sut.healthcheck(CALLBACK_MOCK);
        });

        afterAll(() => {
            getWebhookInfoSpy.mockRestore();
        });

        it('should send request for telegram webhook status', function() {
            expect(getWebhookInfoSpy).toHaveBeenCalledTimes(1);
        });

        it('should call callback with expected arguments', function () {
            expect(CALLBACK_MOCK).toHaveBeenCalledWith(undefined, { telegramWebhook: MOCKED_WEBHOOK_RESPONSE });
        });
    });
});
