const ecoSchema = require("../Schema/user");
const { MessageActionRow, AttachmentBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, MessageSelectMenu, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "banka",
    aliases: ["hesap", "profil", "profile"],
    cooldown: 5000,
    run: async (client, message, args) => {
        const userId = message.author.id;
        const userData = await ecoSchema.findOne({ id: userId });

        if (!userData) {
            const embed = new EmbedBuilder()
                .setDescription(`Banka hesabınız bulunmamaktadır. .banka-oluştur komutunu kullanarak yeni hesap oluşturunuz.`);
            return message.reply({ embeds: [embed], ephemeral: true });
        }

        if (args[0] === "bio") {
            const newBio = args.slice(1).join(" ");
            if (newBio.length > 0) {
                userData.bio = newBio;
                await userData.save();
                const embed = new EmbedBuilder()
                    .setDescription(`Bio başarıyla güncellendi: **${newBio}**`);
                return message.reply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setDescription("Hata: Bio metni belirtilmedi. Bio eklemek için bir metin giriniz.");
                return message.reply({ embeds: [embed], ephemeral: true });
            }
        }

        const walletBalance = userData.wallet;
        const bankBalance = userData.bank;
        const meslek = userData.meslek;
        const iban = userData.iban;
        const bio = userData.bio || "Bio Ayarlanmamış";

        const embed = new EmbedBuilder()
            .setTitle("Hesap Bilgileri")
            .setColor("Aqua")
            .addFields(
                { name: `:man_raising_hand: **İsim**`, value: `${message.author.username}`, inline: true },
                { name: ":dollar: **Cüzdan Bakiyesi**", value: `$${walletBalance}`, inline: true },
                { name: ":credit_card: **Banka Bakiyesi**", value: `$${bankBalance}`, inline: true },
                { name: ":moneybag: **Toplam Bakiye**", value: `$${walletBalance + bankBalance}`, inline: true },
                { name: ":moneybag: **İban**", value: `${iban}`, inline: true },
                { name: ":construction_worker: **Meslek**", value: `${meslek}`, inline: false },
                { name: ":information_source: **Bio**", value: `${bio}`, inline: false }
            );

        message.reply({
            embeds: [embed],
        });
    },
};
