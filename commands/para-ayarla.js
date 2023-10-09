const { EmbedBuilder } = require("discord.js");
const ecoSchema = require("../Schema/user");
const config = require("../config");

module.exports = {
    name: "para-ayarla",
    aliases: ["ayarla-para", "paraayarla", "ayarlapara"],
    cooldown: 5000,
    run: async (client, message, args) => {
        const userId = message.author.id;
        if (!config.bot.owners.includes(userId)) {
            const embed = new EmbedBuilder()
                .setDescription(`Hey! Sen kurucum değilsin ne yapmaya çalışıyorsun ?`);
            return message.reply({ embeds: [embed] });
        }

        const user = message.mentions.users.first();
        if (!user) {
            const embed = new EmbedBuilder()
                .setDescription("Lütfen para miktarını ayarlamak istediğiniz kullanıcıyı etiketleyin.");
            return message.reply({ embeds: [embed] });
        }

        if (user.bot) {
            const embed = new EmbedBuilder()
                .setDescription("Botların parasını ayarlayamazsınız.");
            return message.reply({ embeds: [embed] });
        }

        const money = args[1];

        if (!money || isNaN(money)) {
            const embed = new EmbedBuilder()
                .setDescription("Lütfen geçerli bir para miktarı belirtin.");
            return message.reply({ embeds: [embed] });
        }

        try {
            const user2 = await ecoSchema.findOne({ id: user.id });
            if (!user2) {
                const embed = new EmbedBuilder()
                    .setDescription("Belirtilen kullanıcı bulunamadı.");
                return message.reply({ embeds: [embed] });
            }

            user2.wallet = money;
            await user2.save();

            const embed = new EmbedBuilder()
                .setDescription(`${user.tag}'ın parası başarıyla ayarlandı: ${money}`);
            return message.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Para ayarlama hatası:", error);
            const embed = new EmbedBuilder()
                .setDescription("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
            return message.reply({ embeds: [embed] });
        }
    }
};
