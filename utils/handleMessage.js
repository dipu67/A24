require("dotenv").config();
const axios = require("axios");
const botUser = require("./botUser");
const BOT_TOKEN = process.env.TOKEN;
const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}`;

const groupId = "-1001795004957"; // Example: -1001234567890
const channelId = "@A24_Army";

// Function to check if a user is an admin
async function isAdmin(chatId, userId) {
  const res = await axios.get(
    `https://api.telegram.org/bot${BOT_TOKEN}/getChatAdministrators?chat_id=${chatId}`
  );
  const admins = res.data.result;
  return admins.some((admin) => admin.user.id === userId);
}

// async function muteUser(chatId, userId) {
//   try {
//     const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/restrictChatMember`, {
//       chat_id: chatId,
//       user_id: userId,
//       permissions: {
//         can_send_messages: false,
//         can_send_media_messages: false,
//         can_send_polls: false,
//         can_send_other_messages: false,
//         can_add_web_page_previews: false,
//         can_change_info: false,
//         can_invite_users: false,
//         can_pin_messages: false
//       }
//     });
//     const data = response.data;
//     if (!data.ok) {
//       console.error('Error muting user:', data.description);
//     }
//   } catch (error) {
//     console.error('Error muting user:', error.message);
//   }
// }

const message = async function handleMessage(message) {
  if (message && message.chat.type === "private") {
    const chatId = message.chat.id;
    const userId = message.from.id;
    const messageId = message.message_id;
    const username = message.from.username;
    const text = message.text;
    const welcomeGif =
        "CgACAgQAAx0Cav2aHQACSmlmFQT23OUYpxTbdFyurDxpi4jIJwACgwUAApoxBVB7Ywrb6zjyVDQE";
    if (text === "/start") {
      console.log(text);
      try {
        let user = await botUser.findOne({ userId: userId });

        if (!user) {
          await botUser.create({
            userId: userId,
            firstName: message.from.first_name,
            lastName: message.from.last_name,
            userName: username,
          });
        }
        await axios.post(`${telegramUrl}/sendAnimation`, {
          chat_id: chatId,
          animation: welcomeGif,
          caption: `Hey,@${username} Welcome to A24 mini app`,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Open A24 App",
                  url: "https://t.me/Airdrops24_bot/A24",
                },
              ],
              [{ text: "Join the community", url: "https://t.me/A24_Army" }],
            ],
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  if (message && message.chat.type === "supergroup") {
    const chatId = message.chat.id;
    const userId = message.from.id;
    const messageId = message.message_id;
    const username = message.from.username;
    const text = message.text;
    const links = message.entities;

    if (message.new_chat_member) {
      const welcomeGif =
        "CgACAgQAAx0Cav2aHQACSmlmFQT23OUYpxTbdFyurDxpi4jIJwACgwUAApoxBVB7Ywrb6zjyVDQE";

      await axios.post(`${telegramUrl}/sendAnimation`, {
        chat_id: chatId,
        animation: welcomeGif,
        caption: `Welcome to the *${message.chat.title}* group, @${message.new_chat_member.username}`,
        reply_markup: {
          inline_keyboard: [
            [{ text: "Channel", url: "https://t.me/A24_Army" }],
            [{ text: "Subscribe", url: "https://www.youtube.com/@airdrops24" }],
          ],
        },
        parse_mode: "MarkdownV2",
      });
    }

    if (text === "hi") {
      try {
        await axios.post(
          `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
          {
            chat_id: chatId,
            text: `Hello, How are you @${username} ?`,
            reply_to_message_id: message.message_id,
          }
        );
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }

    // Check if the message contains a link
    if (links) {
      const containsLink = links.some(
        (entity) => entity.type === "url" || entity.type === "text_link"
      );
      // Link delete code
      if (containsLink) {
        try {
          const NotAllow =
            "CgACAgQAAx0Cav2aHQACXjFmf-t_d-_9PIH8kwPDhTNfRbkfoQACLQMAAqRbFVNvGrZIsJrnhjUE";
          const userIsAdmin = await isAdmin(chatId, userId);

          // Delete the message if the user is not an admin
          if (
            userIsAdmin ||
            (message.forward_from_chat &&
              message.forward_from_chat.username === channelId.slice(1))
          ) {
            console.log(
              `Message with ID: ${messageId} from admin user: ${userId} not deleted`
            );
          } else {
            await axios.post(
              `https://api.telegram.org/bot${BOT_TOKEN}/deleteMessage`,
              {
                chat_id: chatId,
                message_id: messageId,
              }
            );
            await axios.post(
              `https://api.telegram.org/bot${BOT_TOKEN}/sendAnimation`,
              {
                chat_id: chatId,
                animation: NotAllow,
                caption: `Hey, @${username} Link Not Allow`,
              }
            );
            console.log(
              `Deleted message with ID: ${messageId} from user: ${userId}`
            );
          }
        } catch (error) {
          console.error(`Error deleting message: ${error.message}`);
        }
      }
    }

    // if (text.startsWith('/mute')) {
    //     const userIsAdmin = await isAdmin(chatId, userId);

    //     if (userIsAdmin) {
    //       const targetUsername = text.split(' ')[1];
    //       if (targetUsername) {
    //         const targetUser = await getUserByUsername(targetUsername, chatId);
    //         console.log(targetUser +"target");
    //         if (targetUser) {
    //           await muteUser(chatId, targetUser.user.id);
    //         } else {
    //           console.log(`User ${targetUsername} not found.`);
    //         }
    //       } else {
    //         console.log('No target username specified.');
    //       }
    //     } else {
    //       console.log('Mute command issued by non-admin user.');
    //     }
    //   }
  }
};

module.exports = message;
