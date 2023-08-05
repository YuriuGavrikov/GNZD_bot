const TelegramApi = require('node-telegram-bot-api');
const cron = require('node-cron');

const TOKEN = '6421481723:AAGecmtKjMac1rE9aRD9F3gfuOJ0hc28bsk';

const bot = new TelegramApi(TOKEN, { polling: true });

let notification = null;

let isNotification = false;
let currentChatId = '';
let currentData = [];

const dailyNotification = (chatId, data) => {
	//Функция ежедневного уведомления
	const dailyChatId = chatId;
	const dailyData = data;

	return cron.schedule('00 11 * * *', () => {
		const user = dailyData[Math.floor(Math.random() * dailyData.length)];
		bot.sendMessage(
			dailyChatId,
			`🎉 ${user.name} тебе повезло 🎉, записывай кружок ⭕ @${user.username}`
		);
	});
};

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
		command: '/ontimetotalk',
		description: 'Включить уведомление о кружке',
	},
	{
		command: '/offtimetotalk',
		description: 'Отключить уведомление о кружке',
	},
]);

bot.on('message', async (msg) => {
	const text = msg.text;
	const chatId = msg.chat.id;
	const name = msg.from.first_name;
	const username = msg.from.username;

	console.log(username);

	const getUsers = new Promise(function (resolve, reject) {
		//Получает всех юзеров в чате кроме ботов
		const users = [];
		if (/^-/.test(chatId)) {
			bot.getChatAdministrators(chatId)
				.then((data) => {
					data.forEach((item) => {
						if (item.user.is_bot === false)
							users.push({
								name: item.user.first_name,
								username: item.user.username
							});
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
		return bot.sendMessage(chatId, `Тебя зовут ${name} 🎉`);
	}
	if (text === '/ontimetotalk' ||
		text === '/ontimetotalk@the_gnzd_bot' ||
		text === '/offtimetotalk' ||
		text === '/offtimetotalk@the_gnzd_bot') {
		if (/^-/.test(chatId) !== true) {
			//Проверяет групповой это чат или нет
			bot.sendMessage(
				chatId,
				'Это работает только в груповых чатах'
			);
		} else {
			if (text === '/ontimetotalk' ||
				text === '/ontimetotalk@the_gnzd_bot') {
				//Включает ежедневное уведомление
				if (isNotification === false) {
					isNotification = true;
					getUsers.then((data) => {
						currentChatId = chatId;
						currentData = data;
					}).then(() => {
						notification = dailyNotification(currentChatId, currentData);
					}).then(() => {
						notification.start();
						bot.sendMessage(
							chatId,
							'Уведомление включено'
						);
					});
				} else {
					bot.sendMessage(
						chatId,
						'Уведомление уже включено'
					);
				}
			} else if (text === '/offtimetotalk' ||
				text === '/offtimetotalk@the_gnzd_bot') {
				//Отключает ежедневное уведомление
				if (isNotification === true) {
					isNotification = false;
					notification.stop();
					bot.sendMessage(
						chatId,
						'Уведомление отключено'
					);
				} else {
					bot.sendMessage(
						chatId,
						'Уведомление уже отключено'
					);
				}
			}
		}
	}
});