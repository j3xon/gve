const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'modalSubmit',
    async execute(interaction) {
        if (interaction.customId === 'suggestionModal') {
            const suggestion = interaction.fields.getTextInputValue('suggestionInput');

            // Create an embed to send the suggestion
            const embed = new EmbedBuilder()
                .setColor(0x7091fd)
                .setTitle('Suggestion Submitted')
                .setDescription(suggestion)
                .addFields({ name: 'Suggested By', value: `<@${interaction.user.id}>` })
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true })); // Add user's avatar

            // Send the embed to the specified channel
            const channel = await interaction.client.channels.fetch('1294610590219767880');
            const sentMessage = await channel.send({ embeds: [embed] });

            // Add thumbs up and thumbs down reactions
            await sentMessage.react('👍');
            await sentMessage.react('👎');

            // Acknowledge the modal submission with a follow-up message
            await interaction.reply({ content: 'Thank you for your suggestion!', ephemeral: true });
        }
    },
};
