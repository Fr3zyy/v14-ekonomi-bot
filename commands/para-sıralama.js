const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const User = require("../Schema/user");

module.exports = {
  name: "leaderboard",
  aliases: ["para-sıralama", "cash-top", "topcash", "cash-sıralama"],
  cooldown: 5000,
  run: async (client, message, args) => {
    try {
      const topUsers = await User.find({ id: { $in: message.guild.members.cache.map((member) => member.user.id) } }).sort({ wallet: -1 }).limit(10);

      if (topUsers.length === 0) {
        return message.reply({
          embeds: [new EmbedBuilder().setColor('Blurple').setDescription(`Hiç kimse para bulundurmuyor.`)],
        });
      }

      const leaderboard = topUsers.map((user, index) => {
        return `**#${index + 1}.** <@${user.id}> - $**${user.wallet}**`;
      });

      const leaderboardMessage = leaderboard.join("\n");

      const embed = new EmbedBuilder()
        .setTitle(`${message.guild.name} Sunucusunun Para Sıralaması`)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setDescription(leaderboardMessage)
        .setColor('Blurple')
        .setFooter({ text: `${message.author.username} Tarafından kullanıldı`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
      await message.reply({ embeds: [embed] });
    } catch (error) {
       message.reply({ content: "Bir hata oluştu.", ephemeral: true });
    }
  }
};
