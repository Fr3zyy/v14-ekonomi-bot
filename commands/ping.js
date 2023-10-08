const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "ping",
    aliases: ["pong"],
    cooldown: 5000,
    run: async (client, message, args) => {
      message.reply(`Pong 🏓 ${client.ws.ping}`)
    }
 };