const { Permissions, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-ticket')
        .setDescription('Create a ticket')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction) {

        await interaction.reply({ content: 'Setting up ticket system...', ephemeral: true });

        const image = "https://cdn.discordapp.com/attachments/1256655891424346202/1274018542047596678/pixelcut-export_42.png?ex=66c0b9ba&is=66bf683a&hm=f98d8f74bf7abc643049094f23c60423416e5bf3233d6d6158732dd88493eaba&";

        const embed = new EmbedBuilder()
            .setTitle('Server Support')
            .setColor(0x7091fd)
            .setDescription(`
Please select the appropriate section for your needs. Any troll tickets will lead to moderation action. Kindly wait for our staff team to assist you.`)
            .setThumbnail("https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096")
            .setImage("https://cdn.discordapp.com/attachments/1294341752068767874/1294583147970691123/Session_Startup_9.png?ex=670b8a02&is=670a3882&hm=da4d075252013f2736c46763145aff264900298434c1f3f63caa5e504963e1f3&")
            .setFooter({
                text: 'Greenville Extreme',
                iconURL: 'https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096'
            });

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('ticket_select')
            .setPlaceholder('Select an option')
            .addOptions([
                {
                    label: 'Staff Report',
                    description: 'Report a staff member.',
                    value: 'staff_report',
                },
                {
                    label: 'Civilian Report',
                    description: 'Report a civilian.',
                    value: 'civ_report',
                },
                {
                    label: 'General Support',
                    description: 'Get general support.',
                    value: 'general_support',
                },
            ]);

        const row = new ActionRowBuilder()
            .addComponents(selectMenu);

        await interaction.channel.send({ embeds: [embed], components: [row]});

        await interaction.editReply({ content: 'Ticket system setup complete!', ephemeral: true });
    },
};
