const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`serverinformation`)
        .setDefaultMemberPermissions(0)
        .setDescription('serverinformation'),
    async execute(interaction) {
        // Define the target channel ID
        const targetChannelId = '1294299028221202464';

        // Fetch the channel using the client
        const targetChannel = interaction.client.channels.cache.get(targetChannelId);

        if (!targetChannel) {
            return interaction.reply({ content: 'Channel not found!', ephemeral: true });
        }

        const rulesEmbed = new EmbedBuilder()
            .setThumbnail("https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096")
            .setImage("https://cdn.discordapp.com/attachments/1294341752068767874/1294559675638874173/Session_Startup_7.png?ex=670b7426&is=670a22a6&hm=240bf148f28a05364174ab35636abc64dafb61c69d7574f01bc240009a148793&")
            .setDescription(`Welcome to the GVE server information channel, this is where you can get all the information provided in the roleplay server. Please note we are a [Greenville Roleplay Group](https://www.roblox.com/games/891852901/Greenville). `)
.setTitle('GVE | Server Information')
.setColor(`#7091fd`)
.setFooter({
    text: 'Greenville Extreme',
    iconURL: 'https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096'
});

        // Create the select menu
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('server_information')
            .setPlaceholder('Select an option')
            .addOptions([
                {
                    label: 'Server Information',
                    description: 'View the server information',
                    value: 'sf'
                },
                {
                    label: 'FAQ',
                    description: 'This is where we can answer most of your questions.',
                    value: 'fq'
                },
                {
                    label: 'Roleplay Information',
                    description: 'View the roleplay information',
                    value: 'rf'
                },
                {
                    label: 'Server Links',
                    description: 'View the server links',
                    value: 'sl'
                }
            ]);

        // Create action row for the select menu
        const row = new ActionRowBuilder().addComponents(selectMenu);

        // Send the embed and the select menu to the specific channel
        await targetChannel.send({ embeds: [rulesEmbed], components: [row] });

        // Optionally acknowledge the command to avoid timeout
        await interaction.reply({ content: 'Session rules sent to the channel.', ephemeral: true });
    },
};
