const {
    SlashCommandBuilder,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggestions')
        .setDescription('Submit a suggestion'),

    async execute(interaction) {
        // Ensure the interaction is not already acknowledged
        if (interaction.replied || interaction.deferred) {
            return;
        }

        // Create a modal
        const modal = new ModalBuilder()
            .setCustomId('suggestionModal')
            .setTitle('Suggestion');

        // Create the text input
        const suggestionInput = new TextInputBuilder()
            .setCustomId('suggestionInput')
            .setLabel("What would you like to suggest?")
            .setStyle(TextInputStyle.Paragraph) // Use Paragraph for multiline
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(suggestionInput);
        modal.addComponents(actionRow);

        // Show the modal to the user
        await interaction.showModal(modal).catch((error) => {
            // Log only if it's not an "Unknown interaction" or "Invalid interaction" error
            if (error.code !== 10062 && error.code !== 40060) {
                console.error('Failed to show modal:', error);
            }
        });
    },
};
