const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cohost')
        .setDescription('Tells the server you are cohosting the session being hosted')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers),
    async execute(interaction) {
        const user = interaction.user; 
        const textChannelId = '1294300210096373830'; 
        const embedChannelId = '1294301892129722389'; 

        try {
            const textChannel = await interaction.client.channels.fetch(textChannelId);
            await textChannel.send({ content: `*<@${user.id}> is now co-hosting the session.*` });

            const sessionEmbed = new EmbedBuilder()
                .setTitle("Session Startup")
                .setDescription(`<@${interaction.user.id}> is now co-hosting the session in <#1294300210096373830>.`)
                .setColor(`#1D4DDE`)
                .setFooter({
                    text: 'Southwest Florida Roleplay Adventures',
                    iconURL: 'https://cdn.discordapp.com/icons/1258897081314312255/32c3c329bec0e93f0a0f6e9347251930.png?size=4096'
                });
            const embedChannel = await interaction.client.channels.fetch(embedChannelId);
            await embedChannel.send({ embeds: [sessionEmbed] });

            await interaction.reply({ content: 'You are now set as co-host in the session.', ephemeral: true });
        } catch (error) {
            console.error('Error sending message or embed:', error);
            await interaction.reply({ content: 'There was an error trying to send the message or embed.', ephemeral: true });
        }
    },
};
