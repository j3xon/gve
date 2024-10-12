const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('staffinfo')
        .setDefaultMemberPermissions(0)
        .setDescription('Use this command to view the server information'),
    async execute(interaction) {
        // Define the target channel ID
        const targetChannelId = '1294301246928457780';

        // Fetch the channel using the client
        const targetChannel = interaction.client.channels.cache.get(targetChannelId);

        if (!targetChannel) {
            return interaction.reply({ content: 'Channel not found!', ephemeral: true });
        }

        const mainEmbed = new EmbedBuilder()
            .setTitle('Staff Information')
            .setImage("https://cdn.discordapp.com/attachments/1294341752068767874/1294560787490279474/Session_Startup_8.png?ex=670b752f&is=670a23af&hm=8e3ecd5fd8172cea09882b47d1246ac59a25ead646520bf3e27c43e977e46f55&")
            .setThumbnail("https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096")
            .setDescription('**Welcome to the staff information channel**. This is where you can get information on how to become an excellent staff member in our server. We expect you to have professionalism within the server. To view the staff information, click on one of the dropdown options to view the information needed.')
            .setColor(`#7091fd`);

        // Create the select menu
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('staff')
            .setPlaceholder('Select an option')
            .addOptions([
                {
                    label: 'Information',
                    description: 'Information for staff.',
                    value: 'information_staff'
                },
                {
                    label: 'Session Commands',
                    description: 'All the session commands built into the bot.',
                    value: 'scommands'
                },
                {
                    label: 'Extra Information',
                    description: 'Extra information for staff.',
                    value: 'extra'
                }
            ]);

        // Create action row for the select menu
        const row = new ActionRowBuilder().addComponents(selectMenu);

        // Send the embed and the select menu to the specific channel
        await targetChannel.send({ embeds: [mainEmbed], components: [row] });

        // Optionally acknowledge the command to avoid timeout
        await interaction.reply({ content: 'Staff information sent to the channel.', ephemeral: true });
    },
};
