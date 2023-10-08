const { MessageActionRow, ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const ecoSchema = require("../Schema/user");

module.exports = {
    name: "banka-oluştur",
    aliases: ["hesap-oluştur", "bankaoluştur", "hesapoluştur"],
    cooldown: 5000,//1 saniye = 1000 ms / cooldown olmasını istemezseniz 0 yazın.
    run: async (client, message, args) => {
        const Data = await ecoSchema.findOne({ id: message.author.id });

        const embed = new EmbedBuilder()
            .setTitle("Hesap")
            .setColor("Aqua")
            .setDescription("Yapmak istediğin işlemi seç!")
            .addFields({
                name: "Oluştur",
                value: "Yeni hesap **oluştur**."
            })
            .addFields({
                name: "Sil",
                value: "Var olan hesabını **sil**."
            });

        const embed2 = new EmbedBuilder()
            .setTitle("Hesap")
            .setColor("Aqua")
            .setDescription("Hesap oluşturuldu")
            .addFields({
                name: "Başarılı",
                value: "Banka hesabınız başarıyla oluşturuldu! Hesabını açtığın için 2000$ hesabınıza eklendi."
            })

        const embed3 = new EmbedBuilder()
            .setTitle("Hesap")
            .setColor("Aqua")
            .setDescription("Hesap silindi")
            .addFields({
                name: "Başarılı",
                value: "Banka hesabın başarıyla silindi."
            })

        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('page1')
                    .setEmoji('<:tik:1159571030394802266>')
                    .setLabel("Oluştur")
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId('page2')
                    .setEmoji('<:carpi:1159571132639346778>')
                    .setLabel("Sil")
                    .setStyle(ButtonStyle.Danger)
            );

        const mesaj = await message.reply({ embeds: [embed], components: [button] });

        const collector = await mesaj.createMessageComponentCollector();

        collector.on('collect', async i => {
            if (i.customId === "page1") {
                if (i.user.id !== message.author.id) {
                    return i.reply({ content: `Bu komutu sadece ${message.author.username} kullanabilir.`, ephemeral: true });
                }

                const deletedData = await ecoSchema.findOneAndDelete({ id: message.author.id });

                if (!deletedData) {
                    const newData = new ecoSchema({
                        id: message.author.id,
                        wallet: 2000,
                        bank: 0,
                        iban: `TR${message.author.id}`
                    });

                    await newData.save();

                    await i.update({ embeds: [embed2], components: [] });
                } else {
                    const embed2 = new EmbedBuilder()
                        .setColor("Aqua")
                        .addFields({
                            name: "Hata!",
                            value: "Hey! Senin zaten bir hesabın var!"
                        })

                    await i.update({ embeds: [embed2], components: [] });
                }
            }

            if (i.customId === "page2") {
                if (i.user.id !== message.author.id) {
                    return i.reply({ content: `Bu komutu sadece ${message.author.username} kullanabilir.`, ephemeral: true });
                }



                const embed2 = new EmbedBuilder()
                    .setColor("Aqua")
                    .addFields({
                        name: "Hata!",
                        value: "Hey! banka hesabın bulunmuyor"
                    })
                    const userData = await ecoSchema.findOne({ id: message.author.id });


                    if (!userData) {
                        return i.update({embeds: [embed2] , components: []});
                    }

                await i.update({ embeds: [embed3], components: [] });
                await ecoSchema.findOneAndDelete({ id: message.author.id });

            }
        });
    },
};
