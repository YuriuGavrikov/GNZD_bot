const TelegramApi = require('node-telegram-bot-api');

const TOKEN = '6421481723:AAGecmtKjMac1rE9aRD9F3gfuOJ0hc28bsk';

const bot = new TelegramApi(TOKEN, { polling: true });

bot.setMyCommands([
	{ command: '/start', description: 'Начальное приветствие' },
	{ command: '/whatismyname', description: 'Как меня зовут' },
]);

bot.on('message', async (msg) => {
	const text = msg.text;
	const chatId = msg.chat.id;
	const name = msg.from.first_name;

	if (text === '/start') {
		return bot.sendMessage(chatId, `Здарова, ты попал к боту банды GNZD`);
	}
	if (text === '/whatismyname') {
		return bot.sendMessage(chatId, `Тебя зовут ${name}`);
	}

	return bot.sendMessage(
		chatId,
		`Я тебя не понимаю, я же не такой умный как ты блять`
	);
});
