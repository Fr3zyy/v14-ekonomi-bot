const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "yardım",
    aliases: ["y" , "h" , "help", "bilgi"],
    cooldown: 5000,
    run: async (client, message, args) => {
        const embed = new EmbedBuilder()
        .setTitle("Fr3zy Ekonomi Bot Altyapısı")
        .addFields({ name: ":bank: **Banka Komutları**", value: '`banka-oluştur` , `banka-yatır` , `banka-çek` , `banka` , `transfer`' })
        .addFields({ name: ":man_office_worker: **Meslek Komutları**", value: '`meslek` , `meslek-ayrıl` , `çalış`' })
        .addFields({ name: ":money_with_wings: **Ekonomi Komutları**", value: '`çal` , `günlük` , `cf`' })
        .addFields({ name: ":bar_chart: **Sıralama Komutları**", value: '`para-sıralama`' })
        
        message.reply({ embeds: [embed] });
    }
 };