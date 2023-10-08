const { Client, GatewayIntentBits, Events, Collection } = require("discord.js");
const fs = require('node:fs');
const path = require('node:path');
const INTENTS = Object.values(GatewayIntentBits);
const client = new Client({ intents: INTENTS });
const config = require("./config.js");
const chalk = require('chalk');
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { readdirSync } = require("fs");
const moment = require("moment");
const mongoose = require("mongoose");
const AntiCrash = require("./Utils/AntiCrash.js");
let token = config.bot.token;

client.commands = new Collection();
client.commandaliases = new Collection();
const rest = new REST({ version: "10" }).setToken(token);

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

require("./Utils/AntiCrash.js")(client);