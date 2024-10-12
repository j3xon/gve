const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('membercount')
        .setDescription('Displays the current member count of the server'),
    async execute(interaction) {
        const guild = interaction.guild;

        if (!guild) {
            await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            return;
        }

        const memberCount = guild.memberCount;

        const embed = {
            title: 'Members',
            description: `${memberCount}`,
            timestamp: new Date(),
            color: 0x7091fd,
        };

        await interaction.reply({ embeds: [embed] });
    },
};
