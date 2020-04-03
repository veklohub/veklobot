const logger = require('../common/logger');
const telegramMessageSender = require('../services/telegramMessageSender');

const exchangeRate = (message) => {
    telegramMessageSender.sendMessage(
        message.chat.id,
        `Привет, ${message.from.first_name || message.from.username}. Доллар по курсу НБУ на сегодня составляет`,
        (error) => {
            if (error) {
                logger.error(error);
            }
        }
    );
};

module.exports = exchangeRate;
