const { EmbedBuilder } = require("discord.js");
const User = require("../Schema/user");
module.exports = {
    name: "çal",
    aliases: ["hırsızlık", "paraçal", "para-çal"],
    cooldown: 300000,
    run: async (client, message, args) => {
        try {
            const userId = message.author.id;
            const targetUser = message.mentions.users.first();
            const userData = await User.findOne({ id: userId });

            if (targetUser.bot) {
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('Çalma Başarısız')
                    .setDescription('Botun parasını nasıl çalacaksın ?!?!`')
                    .setTimestamp();

                return message.reply({ embeds: [embed] });
            }

            if (!targetUser) {
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('Çalma Başarısız')
                    .setDescription('Kullanım: `.çal @kullanıcı`')
                    .setTimestamp();

                return message.reply({ embeds: [embed] });
            }
            if (!userData) {
                const embed = new EmbedBuilder()
                .setDescription(`Banka hesabınız bulunmamaktadır. .banka-oluştur komutunu kullanarak yeni hesap oluşturunuz.`)
                return message.reply({ embeds: [embed], ephemeral: true });
              }
            if (targetUser.id === message.author.id) {
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('Çalma Başarısız')
                    .setDescription('Kendinizi soymaya çalışmak komik! <a:hahaha:1159854256870916247>')
                    .setTimestamp();

                return message.reply({ embeds: [embed] });
            }

            const targetUserData = await User.findOne({ id: targetUser.id });
            const userUserData = await User.findOne({ id: userId });

            if (!targetUserData || targetUserData.wallet <= 0) {
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('Çalma Başarısız')
                    .setDescription('Hedef kullanıcının yeterli parası yok.')
                    .setTimestamp();

                return message.reply({ embeds: [embed] });
            }

            const minAmount = 50;
            const maxAmount = 10000;
            const stolenAmount = Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount;

            if (stolenAmount > targetUserData.wallet) {
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('Çalma Başarısız')
                    .setDescription('Hedef kullanıcının parası çalmak istediğiniz miktardan daha az.')
                    .setTimestamp();

                return message.reply({ embeds: [embed] });
            }

            userUserData.wallet += stolenAmount;
            await userUserData.save();

            targetUserData.wallet -= stolenAmount;
            await targetUserData.save();

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Çalma İşlemi Başarılı')
                .setDescription(`${message.author.username}, ${targetUser.username}'dan $${stolenAmount} çaldı!`)
                .setTimestamp();

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply("Bir hata oluştu.");
        }
    },
};
