const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('session-rules')
        .setDefaultMemberPermissions(0)
        .setDescription('Displays the session rules and options.'),
    async execute(interaction) {
        // Defer the reply to avoid timeout
        await interaction.deferReply({ ephemeral: true });

        const image = "https://cdn.discordapp.com/attachments/1294341752068767874/1294557477492494336/Session_Startup_6.png?ex=670b721a&is=670a209a&hm=9a24770d97547d417a4cfa155e45044958dcb0ce6be025bb6beca6f84bfb3dc7&";
        const targetChannelId = '1294300210096373830';
        const targetChannel = interaction.client.channels.cache.get(targetChannelId);

        if (!targetChannel) {
            return interaction.editReply({ content: 'Channel not found!', ephemeral: true });
        }

        const rulesEmbed = new EmbedBuilder()
            .setTitle('Roleplay Startup')
            .setDescription(`Welcome to the roleplay startup channel. This is where the GVE staff team would host roleplay sessions. You will be notified when a roleplay session starts.
                
                Make sure to read the laws by using the dropdown below and read our information at <#1294299028221202464>`)
            .setThumbnail("https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096")
            .setImage("https://cdn.discordapp.com/attachments/1294341752068767874/1294557477492494336/Session_Startup_6.png?ex=670b721a&is=670a209a&hm=9a24770d97547d417a4cfa155e45044958dcb0ce6be025bb6beca6f84bfb3dc7&")
            .setColor(`#7091fd`)
            .setFooter({
                text: 'Greenville Extreme',
                iconURL: 'https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096'
            });

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('session_options')
            .setPlaceholder('Select an option')
            .addOptions([
                {
                    label: 'Laws',
                    description: 'The laws when roleplaying.',
                    value: 'law'
                },
                {
                    label: 'Session Ping',
                    description: 'Toggle Session Ping role',
                    value: 'session_ping'
                }
            ]);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        // Send the embed and the select menu to the specific channel
        await targetChannel.send({embeds: [rulesEmbed], components: [row] });

        // Edit the original interaction reply to acknowledge success
        await interaction.editReply({ content: 'Session rules sent to the channel.', ephemeral: true });
    },
};
