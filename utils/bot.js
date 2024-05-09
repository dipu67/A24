const TelegramBot = require("node-telegram-bot-api");

const Token = "5804440023:AAGfl_z0I1auOgd6kjeeP5mBPKG8k8u3Zxo";
const bot = new TelegramBot(Token, { polling: true });
const welcomeGif =
"CgACAgQAAx0Cav2aHQACSmlmFQT23OUYpxTbdFyurDxpi4jIJwACgwUAApoxBVB7Ywrb6zjyVDQE";
const adminIds = 2041128532;

//When new user join group to welcome message
bot.on("new_chat_members", (msg) => {
  const chatId = msg.chat.id;
  const newMembers = msg.from.username;
  const options = {
    caption: `Welcome to the ${msg.chat.title} group, @${newMembers}!`,
    reply_markup: {
      inline_keyboard: [
        [{ text: "Channel", url: "https://t.me/airdrops730" }],
        [{ text: "Subscribe", url: "https://www.youtube.com/@airdrops24" }],
      ],
    },
  };

  bot.sendAnimation(chatId, welcomeGif, options);
});

// leave message when user leave group
bot.on("left_chat_member", (msg) => {
  const chatId = msg.chat.id;
  const leftMembers = msg.from.username;
  const leftGif =
    "CgACAgQAAxkBAANkZhUcY14zv3UJWNw7x0c83OVZbv0AAhMDAAKmwwVTXXJXN_0V6po0BA";
  const options = {
    caption: `Leave to the ${msg.chat.title} group, @${leftMembers}!`,
  };

  bot.sendAnimation(chatId, leftGif, options);
});

bot.onText(/\/remove/, (msg) => {
  const chatId = msg.chat.id;

  // Define the remove keyboard markup
  const removeKeyboardMarkup = {
    reply_markup: {
      remove_keyboard: true,
    },
  };

  // Send a message with the remove keyboard markup
  bot.sendMessage(chatId, "Keyboard removed.", removeKeyboardMarkup);
}); 

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const text = msg.text;
  const user = msg.from.username;
  const groupName = msg.chat.username;
  const photo = msg.photo;
  const dice = msg.dice;
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId,'Receve massage')

  // console.log(msg);
});
