const ecoSchema = require("../Schema/user");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "para-transfer",
    aliases: ["transfer", "gönder", "para-gönder", "cashsend", "send"],
    cooldown: 5000,
    run: async (client, message, args) => {
        const senderId = message.author.id;
        const receiverIban = args[0];
        const transferAmount = parseInt(args[1]);

        if (!receiverIban || isNaN(transferAmount) || transferAmount <= 0) {
            const embed = new EmbedBuilder()
                .setDescription("Geçerli bir IBAN numarası ve geçerli bir miktar belirtmelisiniz. \n**Doğru Kullanım :** .transfer TR123456789 25000")
            return message.reply({ embeds: [embed] });
        }

        const senderData = await ecoSchema.findOne({ id: senderId });
        const receiverData = await ecoSchema.findOne({ iban: receiverIban });

        if (!senderData) {
            const embed = new EmbedBuilder()
                .setDescription("Hesabınız bulunmamaktadır. Önce bir hesap oluşturmalısınız.")
            return message.reply({ embeds: [embed] });
        }

        if (!receiverData) {
            const embed = new EmbedBuilder()
                .setDescription("Alıcı bulunamadı. Geçerli bir IBAN numarası girdiğinizden emin olun.")
            return message.reply({ embeds: [embed] });
        }

        if (senderData.bank < transferAmount) {
            const embed = new EmbedBuilder()
                .setDescription("Banka hesabınızdaki para yetersiz.")
            return message.reply({ embeds: [embed] });
        }

        senderData.bank -= transferAmount;
        receiverData.bank += transferAmount;

        await senderData.save();
        await receiverData.save();

        const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`Para transferi başarıyla tamamlandı. ${transferAmount} miktarında para, ${receiverIban} IBAN numarasına transfer edildi.`)
        return message.reply({ embeds: [embed] });
    }
};
