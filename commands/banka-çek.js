const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const ecoSchema = require("../Schema/user");

module.exports = {
    name: "banka-çek",
    aliases: ["para-çek" , "paraçek" , "bankaçek"],
    cooldown: 5000,
    run: async (client, message, args) => {
      const userId = message.author.id;
      const amountToWithdraw = parseInt(args[0]);

      if (isNaN(amountToWithdraw) || amountToWithdraw <= 0) {
          return message.reply("Geçerli bir miktar belirtmelisiniz.");
      }

      const userData = await ecoSchema.findOne({ id: userId });

      if (!userData) {
        const embed = new EmbedBuilder()
            .setDescription(`Banka hesabınız bulunmamaktadır. .banka-oluştur komutunu kullanarak yeni hesap oluşturunuz.`)
        return message.reply({ embeds: [embed], ephemeral: true });
    }
      if (userData.bank < amountToWithdraw) {
          return message.reply("Yetersiz banka bakiyesi.");
      }

      userData.bank -= amountToWithdraw;
      userData.wallet += amountToWithdraw;

      await userData.save();

      const embed = new EmbedBuilder()
          .setTitle("Para Çekme")
          .setColor("Aqua")
          .setDescription(`Bankadan ${amountToWithdraw} coin çektiniz. Yeni cüzdan bakiyesi: $${userData.wallet}`);

      message.channel.send({ embeds: [embed] });
    }
 };