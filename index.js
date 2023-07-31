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

	const getUsers = new Promise(function (resolve, reject) {
		const users = [];
		if (/^-/.test(chatId)) {
			bot.getChatAdministrators(chatId)
				.then((data) => {
					data.forEach((item) => {
						if (item.user.is_bot === false)
							users.push(item.user.first_name);
					});
				})
				.then(() => {
					resolve(users);
				});
		} else {
			return resolve(users);
		}
	});

	if (text === '/start' || text === '/start@the_gnzd_bot') {
		return bot.sendMessage(chatId, `Здарова, ты попал к боту банды GNZD`);
	}
	if (text === '/whatismyname' || text === '/whatismyname@the_gnzd_bot') {
		return bot.sendMessage(chatId, `Тебя зовут ${name}`);
	}
	if (text === '/timetotalk' || text === '/timetotalk@the_gnzd_bot') {
		getUsers.then((data) => {
			if (data.length === 0) {
				return bot.sendMessage(
					chatId,
					'Это работает только в групповых чатах'
				);
			} else {
				return bot.sendMessage(
					chatId,
					`${
						data[Math.floor(Math.random() * data.length)]
					} тебе повезло, записывай кружок`
				);
			}
		});
	}
});
