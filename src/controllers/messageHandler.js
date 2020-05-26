const logger = require('../common/logger');
const exchangeRate = require('./exchangeRate');
const jobs = require('./jobs');
const commands = require('../consts/commands');
const telegramMessageSender = require('../services/telegramMessageSender');

const messageHandler = (response) => {
    let message;

    if (response.callback_query) {
        telegramMessageSender.answerCallbackQuery({ callbackQueryId: response.callback_query.id });
        message = response.callback_query;
    } else {
        message = response.message;
    }

    if (
        !message ||
        (!message.text && !message.data) ||
        !message.from
    ) {
        logger.warn(`Got strange empty message: ${JSON.stringify(message)}`);
    } else if (message.from.is_bot) {
        logger.warn(`Message from bot, didn't handle it: ${message}`);
    } else {
        const messageText = message.text || message.data;
        const messageChatId = message.chat ? message.chat.id : message.message.chat.id;

        if (messageText.includes(commands.START.command)) {
            telegramMessageSender.sendMessage({
                chatId: messageChatId,
                message: 'Привет. Вот список доступных команд. Жми нужную кнопку',
                inlineKeyboard: [[{
                    text: commands.DOLLAR_RATE.description,
                    callback_data: commands.DOLLAR_RATE.command
                }]]
            });
        } else if (messageText.includes(commands.DOLLAR_RATE.command)) {
            const jobName = 'USDRate';
            const isFirstTimeRequested = !jobs.isJobExists(jobName, messageChatId);

            exchangeRate.getUSDRate(messageChatId, isFirstTimeRequested);

            if (isFirstTimeRequested) {
                jobs.addJob(jobName, messageChatId);
            }
        } else {
            logger.warn(`Unknown message: ${JSON.stringify(message)}`);
        }
    }
};

module.exports = messageHandler;
