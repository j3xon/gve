const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bannnedvehicles')
        .setDefaultMemberPermissions(0)
        .setDescription('banned vehicles'),
    async execute(interaction) {
        // Define the target channel ID
        const targetChannelId = '1294312012075241552';

        // Fetch the channel using the client
        const targetChannel = interaction.client.channels.cache.get(targetChannelId);

        if (!targetChannel) {
            return interaction.reply({ content: 'Channel not found!', ephemeral: true });
        }

        const rulesEmbed = new EmbedBuilder()
            .setTitle('Restricted Vehicles')
            .setImage("https://cdn.discordapp.com/attachments/1294341752068767874/1294585075521814539/Session_Startup_10.png?ex=670b8bce&is=670a3a4e&hm=2a43574271991ab2fdc8242129775ad410bc718e6b319944d0b2555ff42a3b32&")
            .setDescription(`Welcome to the restricted vehicles channel. Here you can get all the banned vehicles in the roleplay server. To use this vehicles you do need special permisson. `)
            .setColor(0x7091fd);

        // Create the select menu
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('vehicles_banned')
            .setPlaceholder('Select an option')
            .addOptions([
                {
                    label: 'Blacklisted Vehicles',
                    value: 'black'
                },
                {
                    label: 'Banned Vehicles',
                    value: 'ban'
                },
                {
                    label: 'Host permisson',
                    value: 'host'
                },
                {
                    label: 'Slot Vehicles',
                    value: 'slot'
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
