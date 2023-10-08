const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const ecoSchema = require("../Schema/user");

module.exports = {
  name: "meslek-ayril",
  aliases: ["ayrıl", "meslekten-ayrıl", "meslekten-çık", "meslekayrıl", "meslekayril"],
  cooldown: 5000,
  run: async (client, message, args) => {
    const userId = message.author.id;
    const userData = await ecoSchema.findOne({ id: userId });

    if (!userData) {
      const embed = new EmbedBuilder()
          .setDescription(`Banka hesabınız bulunmamaktadır. .banka-oluştur komutunu kullanarak yeni hesap oluşturunuz.`)
      return message.reply({ embeds: [embed], ephemeral: true });
  }

    if (userData.meslek === "İşsiz") {
      const embed = new EmbedBuilder()
      .setDescription(`Dostum zaten meslegin yok !`)
      return message.reply({ embeds: [embed] });
    }

    userData.meslek = "İşsiz";
    await userData.save();
    const embed = new EmbedBuilder()
    .setDescription(`Mesleğinizden ayrıldınız. Artık işsizsiniz.`)
    return message.reply({ embeds: [embed] });
  }
};