const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverstore')
        .setDefaultMemberPermissions(0)
        .setDescription('serverstore'),
    async execute(interaction) {
        // Define the target channel ID
        const targetChannelId = '1294299901781606472';

        // Fetch the channel using the client
        const targetChannel = interaction.client.channels.cache.get(targetChannelId);

        if (!targetChannel) {
            return interaction.reply({ content: 'Channel not found!', ephemeral: true });
        }

        const mainEmbed = new EmbedBuilder()
        .setTitle('Server Store')
        .setThumbnail("https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096")
        .setImage("https://cdn.discordapp.com/attachments/1294341752068767874/1294586914762133588/Session_Startup_11.png?ex=670b8d84&is=670a3c04&hm=9e59a1aa4c9f1606b3d9f90422438f2bed7a7637076191d1f00999beddd265df&")
        .setDescription('Within this channel, you will be able to see what you get once you boost the server or buy perks with Robux. Once you have boosted this server or purchased with Robux, make sure to open a ticket in the support channel to get the role and perks. If you have any questions, do not hesitate to DM a HR or open a support ticket.')
        .setColor(`#616cfd`);

        // Create the select menu
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('perks')
            .setPlaceholder('Select an option')
            .addOptions([
                {
                    label: 'Robux Perks',
                    description: 'View perks for purchasing with Robux',
                    value: 'rp'
                },
                {
                    label: 'Nitro Perks',
                    description: 'View perks for boosting the server',
                    value: 'np'
                },
                {
                    label: 'Money Perks',
                    description: 'View perks for purchasing with Money',
                    value: 'mp'
                }
            ]);

        // Create action row for the select menu
        const row = new ActionRowBuilder().addComponents(selectMenu);

        // Send the embed and the select menu to the specific channel
        await targetChannel.send({ embeds: [mainEmbed], components: [row] });

        // Optionally acknowledge the command to avoid timeout
        await interaction.reply({ content: 'server perks sent to the channel.', ephemeral: true });
    },
};
