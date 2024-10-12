const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot-information')
        .setDescription('Bot information'),
    async execute(interaction) {
        const user = interaction.user;
        const client = interaction.client;

        // Calculate uptime
        const uptime = client.uptime || 0; // Ensure uptime is not undefined
        const hours = Math.floor(uptime / 3600000); // Convert ms to hours
        const minutes = Math.floor((uptime % 3600000) / 60000); // Convert remaining ms to minutes
        const seconds = Math.floor((uptime % 60000) / 1000); // Convert remaining ms to seconds

        const embed = new EmbedBuilder()
            .setTitle('Bot Information')
            .setDescription(`Node.js Version: v22.5.1\nBot Version: 1.0\nDiscord.js: v14.6.0\nDevelopers: <@1114487029925937232>\nUptime: **${hours}h ${minutes}m ${seconds}s**`)
            .setColor(`#7091fd`)
            .setThumbnail("https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096")
            .setFooter({
                text: 'Greenville Extreme',
                iconURL: 'https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096'
            });

        await interaction.channel.send({
            embeds: [embed],
            components: []
        });

        await interaction.reply({ content: 'Bot information sent successfully.', ephemeral: true });
    },
};
