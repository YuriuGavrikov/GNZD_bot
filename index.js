const TelegramApi = require('node-telegram-bot-api');

const TOKEN = '6421481723:AAGecmtKjMac1rE9aRD9F3gfuOJ0hc28bsk';

const bot = new TelegramApi(TOKEN, { polling: true });

bot.setMyCommands([
	{
		command: '/start',
		description: 'Начальное приветствие',
	},
	{
		command: '/whatismyname',
		description: 'Как меня зовут',
	},
	{
		command: '/timetotalk',
		description: 'Кто будет рассказывать',
	},
]);

bot.on('message', async (msg) => {
	const text = msg.text;
	const chatId = msg.chat.id;
	const name = msg.from.first_name;
	const users = [];

	const getUsers = () =>
		bot.getChatAdministrators(chatId).then((data) => {
			data.forEach((user) => {
				if (user.user.is_bot === false) users.push(user.user.first_name);
			});
		});

	if (text === '/start' || text === '/start@the_gnzd_bot') {
		return bot.sendMessage(chatId, `Здарова, ты попал к боту банды GNZD`);
	}
	if (text === '/whatismyname' || text === '/whatismyname@the_gnzd_bot') {
		return bot.sendMessage(chatId, `Тебя зовут ${name}`);
	}
	if (text === '/timetotalk' || text === '/timetotalk@the_gnzd_bot') {
		await getUsers();
		return bot.sendMessage(
			chatId,
			`${
				users[Math.floor(Math.random() * users.length)]
			} тебе повезло, записывай кружок`
		);
	}
});
