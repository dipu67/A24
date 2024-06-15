  const TelegramBot = require("node-telegram-bot-api");
  const Promise = require("bluebird");
  const botUser = require("./botUser");

  const Token = "5804440023:AAGfl_z0I1auOgd6kjeeP5mBPKG8k8u3Zxo";
  const bot = new TelegramBot(Token, { polling: true });
  const welcomeGif =
    "CgACAgQAAx0Cav2aHQACSmlmFQT23OUYpxTbdFyurDxpi4jIJwACgwUAApoxBVB7Ywrb6zjyVDQE";
  const adminIds = 2041128532;

  function sendMessageWithRetry(chatId, message, retryCount = 0) {
    const maxRetries = 5;
    const retryDelay = 1000; // initial delay in ms

    return bot.sendMessage(chatId, message).catch((error) => {
      if (error.code === "ETELEGRAM" && error.response.statusCode === 429) {
        const retryAfter = error.response.parameters.retry_after || 1;

        if (retryCount < maxRetries) {
          return Promise.delay(retryAfter * 1000 + retryCount * retryDelay).then(
            () => sendMessageWithRetry(chatId, message, retryCount + 1)
          );
        }
      }
      throw error;
    });
  }




  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const user = msg.from;
    // console.log(msg);

    const existingUser = await botUser.findOne({ userId: chatId });

    if (!existingUser) {
      let newUser = await botUser.create({
        userId: chatId,
        firstName: user.first_name,
        lastName: user.last_name,
        userName: user.username,
      });
    }

    bot.sendMessage(chatId, "Welcome to A24 bot");
  });

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


  // bot.on("message", async (msg) => {
  //   const chatId = msg.chat.id;

  //   const htmlMessage = `
  //   <b>This is a bold text</b>
  //   <i>This is italic text</i>
  //   <a href="https://example.com">This is a link</a>
  //   <code>This is inline code</code>
  // `;
  //   bot.sendMessage(chatId,htmlMessage, { parse_mode: 'HTML' })

  //   // console.log(msg);
  // });

  const options2 = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Option 1', callback_data: 'option1' }],
        [{ text: 'Option 2', callback_data: 'option2' }],
        [{ text: 'Option 3', callback_data: 'option3' }]
      ]
    }
  };

  async function sendDailyMessage(){
    const image = 'https://images.unsplash.com/photo-1711526637497-bd9ecfc68567?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    const text = 'How are you?'
    const users = await botUser.find() 
    users.forEach((user) =>{
      bot.sendPhoto(user.userId, image, {
        caption: text,
        reply_markup: options2.reply_markup
      })
    })

    

  }
  setInterval(() =>{
    const date = new Date();
  const hour = date.getHours();
  const minites = date.getMinutes();
  if(true ) {
    sendDailyMessage()
  }
  },1000000)