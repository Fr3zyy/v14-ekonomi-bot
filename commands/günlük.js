const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const ecoSchema = require("../Schema/user");
const config = require("../config");
module.exports = {
    name: "günlük",
    aliases: ["daily", "günlük-ödül", "günlüködül"],
    cooldown: 5000,
    run: async (client, message, args) => {
      const userId = message.author.id;
      const cooldownDuration = 24 * 60 * 60 * 1000;

      let userData = await ecoSchema.findOne({ id: userId });

      if (!userData) {
        const embed = new EmbedBuilder()
            .setDescription(`Banka hesabınız bulunmamaktadır. .banka-oluştur komutunu kullanarak yeni hesap oluşturunuz.`)
        return message.reply({ embeds: [embed], ephemeral: true });
    }

      const currentTime = Date.now();
      const lastClaimTime = userData.dailyLastUsed;
      const remainingCooldown = Math.max(0, cooldownDuration - (currentTime - lastClaimTime));

      if (remainingCooldown > 0) {
          const remainingHours = Math.floor(remainingCooldown / (60 * 60 * 1000));
          const remainingMinutes = Math.floor((remainingCooldown % (60 * 60 * 1000)) / (60 * 1000));

          return message.reply(`Bir daha çalışabilmek için ${remainingHours} saat, ${remainingMinutes} dakika beklemelisin.`);
      }
      if (currentTime - lastClaimTime < 6 * 60 * 60 * 1000) {
          return message.reply({ content: "Günlük ödülünü tekrar alabilmek için biraz daha beklemelisin.", ephemeral: true });
      }

      const minCoin = config.daily.min;
      const maxCoin = config.daily.max;
      const dailyReward = Math.floor(Math.random() * (maxCoin - minCoin + 1)) + minCoin;

      // Kullanıcının cüzdanına coin ekleyin
      userData.wallet += dailyReward;
      userData.dailyLastUsed = currentTime;

      await userData.save();

      message.reply({ content: `Günlük ödülünü aldın! ${dailyReward} coin kazandın.` });
    }
 };