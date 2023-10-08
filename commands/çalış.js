const ecoSchema = require("../Schema/user");
const { ButtonBuilder, ButtonStyle, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const config = require("../config");

const cooldownDuration = 24 * 60 * 60 * 1000;

module.exports = {
    name: "çalış",
    aliases: ["para-kazan" , "meslek-çalış"],
    cooldown: 5000,
    run: async (client, message, args) => {
        const userId = message.author.id;

        const userData = await ecoSchema.findOne({ id: userId });

        if (!userData) {
            const embed = new EmbedBuilder()
            .setDescription(`Banka hesabınız bulunmamaktadır. .banka-oluştur komutunu kullanarak yeni hesap oluşturunuz.`)
            return message.reply({ embeds: [embed], ephemeral: true });
          }
        const currentTime = Date.now();
        const lastCalisTime = userData.lastCalisTime || 0;

        const remainingCooldown = Math.max(0, cooldownDuration - (currentTime - lastCalisTime));

        if (remainingCooldown > 0) {
            const remainingHours = Math.floor(remainingCooldown / (60 * 60 * 1000));
            const remainingMinutes = Math.floor((remainingCooldown % (60 * 60 * 1000)) / (60 * 1000));

            return message.reply(`Bir daha çalışabilmek için ${remainingHours} saat, ${remainingMinutes} dakika beklemelisin.`);
        }

        let kazanc = 0;

        if (userData.meslek === "Yazılımcı") {
            kazanc = config.meslek.yazilimciMaas;
        }
        else if (userData.meslek === "Doktor") {
            kazanc = config.meslek.doktorMaas;
        }
        else if (userData.meslek === "Öğretmen") {
            kazanc = config.meslek.ogretmenMaas;
        }
        else {
            return message.reply("Bir meslek seçmediniz.");
        }

        await userData.updateOne({ id: message.author.id, wallet: userData.wallet + kazanc, lastCalisTime: currentTime });
        message.channel.send(`${userData.meslek} olarak çalıştın! Ve $${kazanc} kazandın!`);

    },
};
