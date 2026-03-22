const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const WORKER_URL = 'https://proxy.ginirbi.workers.dev/discord-message';
const CHANNEL_NAME = 'main';

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.channel.name !== CHANNEL_NAME) return;

  try {
    await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: message.author.username,
        content: message.content
      })
    });
  } catch (err) {
    console.error('Failed to forward message:', err);
  }
});

client.login(process.env.BOT_TOKEN);
