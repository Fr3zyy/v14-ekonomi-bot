const { Events, InteractionType, EmbedBuilder } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    execute: async (interaction) => {
        let client = interaction.client;
        if (interaction.type == InteractionType.ApplicationCommand) {
            if (interaction.user.bot) return;
            try {
                const command = client.slashcommands.get(interaction.commandName)
                command.run(client, interaction)
            } catch (e) {
                const embed = new EmbedBuilder()
                .setDescription(`Komut çalıştırılamadı lütfen tekrar deneyin !`)
                interaction.reply({ embeds: [embed], ephemeral: true })
            }
        }
    }
}