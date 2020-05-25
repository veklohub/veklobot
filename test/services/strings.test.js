
const sut = require('../../src/services/strings');

describe('strings service', function() {
    describe('hideTelegramBotToken', () => {
        it('should return URL with hidden token', function() {
            expect(
                sut.hideTelegramBotToken('https://your.domain:443/1234567890:ABCDefghIGKLmnopQRSTuvwxYZ123456789')
            ).toBe('https://your.domain:443/YOUR_TELEGRAM_BOT_TOKEN');
        });

        it('URL doesn\'t match regexp - shouldn\'t hide anything', function() {
            expect(
                sut.hideTelegramBotToken('https://your.domain:443/1234567890:ABCDefgh')
            ).toBe('https://your.domain:443/1234567890:ABCDefgh');
        });
    });
});
