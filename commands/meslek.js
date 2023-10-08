const { ButtonBuilder, ButtonStyle, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const User = require('../Schema/user');

module.exports = {
    name: "meslek",
    aliases: ["meslek-seç", "seç-meslek"],
    cooldown: 5000,
    run: async (client, message, args) => {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Yazılımcı')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("1159841501837271101")
                    .setCustomId('yazilimci'),
                new ButtonBuilder()
                    .setLabel('Doktor')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("1159842207809945681")
                    .setCustomId('doktor'),
                new ButtonBuilder()
                    .setLabel('Öğretmen')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("1159843036939956295")
                    .setCustomId('ogretmen'),
            );

        const embed = new EmbedBuilder()
            .setDescription("Lütfen bir meslek seçin:");

        const mesaj = await message.reply({
            embeds: [embed],
            components: [row],
        });

        const collector = await mesaj.createMessageComponentCollector();

        collector.on('collect', async i => {
            const userData = await User.findOne({ id: message.author.id });
            if (!userData) {
                const embed = new EmbedBuilder()
                    .setDescription(`Banka hesabınız bulunmamaktadır. .banka-oluştur komutunu kullanarak yeni hesap oluşturunuz.`)
                return message.reply({ embeds: [embed], ephemeral: true });
            }
            if (i.customId === "yazilimci") {
                if (i.user.id !== message.author.id) {
                    return i.reply({ content: `Bu komutu sadece ${message.author.username} kullanabilir.`, ephemeral: true });
                }

                if (userData.meslek !== "İşsiz") {
                    const embed = new EmbedBuilder()
                        .setDescription(`Zaten bir mesleğiniz var!`)
                    return i.update({ embeds: [embed], ephemeral: true });
                }

                await User.updateOne({ id: message.author.id }, { meslek: "Yazılımcı" });

                const embed = new EmbedBuilder()
                    .setDescription(`Yazılımcı olarak meslek seçtiniz.`)
                return i.update({ embeds: [embed], ephemeral: true, components: [] });
            }
            if (i.customId === "doktor") {
                if (i.user.id !== message.author.id) {
                    return i.reply({ content: `Bu komutu sadece ${message.author.username} kullanabilir.`, ephemeral: true });
                }

                if (userData.meslek !== "İşsiz") {
                    const embed = new EmbedBuilder()
                        .setDescription(`Zaten bir mesleğiniz var!`)
                    return i.update({ embeds: [embed], ephemeral: true });
                }
                await User.updateOne({ id: message.author.id }, { meslek: "Doktor" });
                const embed = new EmbedBuilder()
                    .setDescription(`Doktor olarak meslek seçtiniz.`)
                return i.update({ embeds: [embed], ephemeral: true, components: [] });
            }
            if (i.customId === "ogretmen") {
                if (i.user.id !== message.author.id) {
                    return i.reply({ content: `Bu komutu sadece ${message.author.username} kullanabilir.`, ephemeral: true });
                }


                if (userData.meslek !== "İşsiz") {
                    const embed = new EmbedBuilder()
                        .setDescription(`Zaten bir mesleğiniz var!`)
                    return i.update({ embeds: [embed], ephemeral: true });
                }

                await User.updateOne({ id: message.author.id }, { meslek: "Öğretmen" });
                const embed = new EmbedBuilder()
                    .setDescription(`Öğretmen olarak meslek seçtiniz.`)
                return i.update({ embeds: [embed], ephemeral: true, components: [] });

            }
        });
    },
};
