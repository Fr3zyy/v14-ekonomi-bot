const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const ecoSchema = require("../Schema/user");

module.exports = {
    name: "banka-yatır",
    aliases: ["para-yatır" , "parayatır" , "bankayatır"],
    cooldown: 5000,
    run: async (client, message, args) => {
      const userId = message.author.id;
      const amountToDeposit = parseInt(args[0]);

      if (isNaN(amountToDeposit) || amountToDeposit <= 0) {
          return message.reply("Geçerli bir miktar belirtmelisiniz.");
      }

      const userData = await ecoSchema.findOne({ id: userId });

      if (!userData) {
        const embed = new EmbedBuilder()
        .setDescription(`Banka hesabınız bulunmamaktadır. .banka-oluştur komutunu kullanarak yeni hesap oluşturunuz.`)
        return message.reply({ embeds: [embed], ephemeral: true });
      }

      if (userData.wallet < amountToDeposit) {
          return message.reply("Yetersiz cüzdan bakiyesi.");
      }

      userData.wallet -= amountToDeposit;
      userData.bank += amountToDeposit;

      await userData.save();

      const embed = new EmbedBuilder()
          .setTitle("Para Yatırma")
          .setColor("Aqua")
          .setDescription(`Bankaya ${amountToDeposit} coin yatırdınız. Yeni banka bakiyesi: $${userData.bank}`);

      message.channel.send({ embeds: [embed] });
    }
 };