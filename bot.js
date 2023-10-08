const { Client, GatewayIntentBits, Events, Collection } = require("discord.js");
const INTENTS = Object.values(GatewayIntentBits);
const client = new Client({ intents: INTENTS });
const config = require("./config.js");
const chalk = require('chalk');
const { readdirSync } = require("fs");
const mongoose = require("mongoose");

client.commands = new Collection();
client.commandaliases = new Collection();

mongoose
    .connect(config.bot.mongoDb, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log(chalk.green("[DATABASE] MongoDB Bağlantısı Başarılı!"));
    })

client.on(Events.ClientReady, async () => {
    console.log(chalk.blue(`[BOT] ${client.user.username} Aktif Edildi!`));
});


readdirSync("./events").forEach(async (file) => {
    const event = await require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
});

readdirSync("./commands").forEach(async (file) => {
    const command = await require(`./commands/${file}`);
    if (command) {
        client.commands.set(command.name, command);
        console.log(chalk.cyan(`[COMMAND] ${command.name} Yüklendi`));
        if (command.aliases && Array.isArray(command.aliases)) {
            command.aliases.forEach((alias) => {
                client.commandaliases.set(alias, command.name);
            });
        }
    }
});

client.login(config.bot.token);
