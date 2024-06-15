// setWebhook.js

const axios = require('axios');

const BOT_TOKEN = process.env.PORT; // Replace with your bot token
const WEBHOOK_URL = 'http://localhost:3000/' + BOT_TOKEN; // Replace with your HTTPS URL

// Function to set the webhook
async function setWebhook() {
    try {
        const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
            url: WEBHOOK_URL
        });

        console.log('Webhook was set:', response.data);
    } catch (error) {
        console.error('Error setting webhook:', error.message);
    }
}

// Call the function to set the webhook
setWebhook();
