const { EmbedBuilder } = require("discord.js");
const ecoSchema = require("../Schema/user");
const config = require("../config");

module.exports = {
    name: "cf",
    aliases: ["coinflip", "coin-flip", "yazıtura", "yazı-tura"],
    cooldown: 5000,
    run: async (client, message, args) => {
        const userId = message.author.id;
        const userData = await ecoSchema.findOne({ id: userId });

        if (!userData) {
            const embed = new EmbedBuilder()
                .setDescription(`Banka hesabınız bulunmamaktadır. .banka-oluştur komutunu kullanarak yeni hesap oluşturunuz.`)
            return message.reply({ embeds: [embed], ephemeral: true });
        }


        const Seçenek = args[0] ? args[0].toLowerCase() : '';

        if (Seçenek !== 'yazı' && Seçenek !== 'tura') {
            const embed = new EmbedBuilder()
                .setDescription(`Geçerli bir seçenek belirtmelisiniz (yazı veya tura).`)
            return message.reply({ embeds: [embed], ephemeral: true });
        }

        const miktar = parseInt(args[1]) || 1;
        if (isNaN(miktar) || miktar <= 0) {
            const embed = new EmbedBuilder()
                .setDescription(`Geçerli bir para miktarı belirtmelisiniz.`)
            return message.reply({ embeds: [embed], ephemeral: true });
        }

        if (miktar > config.coinflip.coinFlipMax) {
            const embed = new EmbedBuilder()
                .setDescription(`En fazla 250k oynayabilirsiniz.`)
            return message.reply({ embeds: [embed], ephemeral: true });
        }
        if (miktar > userData.wallet) {
            const embed = new EmbedBuilder()
                .setDescription(`Paranız yetmiyor.`)
            return message.reply({ embeds: [embed], ephemeral: true });
        }

        const Seçenekler = ['yazı', 'tura']; 
        const Sonuç = Seçenekler[Math.floor(Math.random() * Seçenekler.length)];

        if (Sonuç === Seçenek) {
            const Kazanıldı = new EmbedBuilder()
                .setColor("Blurple")
                .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                .setTitle("Yazı Tura")
                .setDescription(`Kazandın. Seçtiğin seçenek: **${Sonuç}**`)
                .addFields({ name: "Kazanılan Para", value: `$${miktar}` })
                .setTimestamp();
            await userData.updateOne({ id: message.author.id, coinFlipCount: userData.coinFlipCount + 1, wallet: userData.wallet + miktar });


            await message.reply({ embeds: [Kazanıldı] });
        } else {
            const Kaybedildi = new EmbedBuilder()
                .setColor("Red")
                .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                .setTitle("Yazı Tura")
                .setDescription(`Kaybettin. Gelen seçenek: **${Sonuç}**`)
                .addFields({ name: "Kaybedilen Para", value: `$${miktar}` })
                .setTimestamp();
            await userData.updateOne({ id: message.author.id, coinFlipCount: userData.coinFlipCount + 1, wallet: userData.wallet - miktar });

            await message.reply({ embeds: [Kaybedildi] });
        }
    }
};
