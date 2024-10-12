const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('early')
        .setDescription('Sends the early access embed.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addStringOption(option =>
            option.setName('session-link')
                .setDescription('Link for the session so that EA people can join.')
                .setRequired(true)),
    async execute(interaction) {
        const sessionLink = interaction.options.getString('session-link');

        const embed = new EmbedBuilder()
            .setTitle('GVE | Early Access')
            .setDescription('Early Access is now Live! Nitro Boosters, members of the Emergency Services, and Content Creators can join the session by clicking the button below.\n\nPlease keep in mind that sharing the session link with anyone is strictly forbidden and may lead to penalties. We appreciate your cooperation in keeping our community secure and fair for everyone.')
            .setColor(`#7091fd`)
            .setImage("https://cdn.discordapp.com/attachments/1294341752068767874/1294387174074093598/Session_Startup_1.png?ex=670ad37e&is=670981fe&hm=3b616082a0da71852a8a67fe3119974e95108ae5abba14b694d7011ea3354810&")
            .setFooter({
                text: 'Greenville Extreme',
                iconURL: 'https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096'
            });

        const eaButton = new ButtonBuilder()
            .setLabel('Early Access')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('ea');

        const howToGetEaButton = new ButtonBuilder()
            .setLabel('Get Early Access')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('howToGetEa');

        const row = new ActionRowBuilder()
            .addComponents(eaButton, howToGetEaButton);

        const newEmbed = new EmbedBuilder()
            .setTitle("Session Early Access")
            .setDescription(`<@${interaction.user.id}> released early access. The link is provided below\n\n**Link:** ${sessionLink}`)
            .setColor(`#7091fd`)
            .setFooter({
                text: 'Greenville Extreme',
                iconURL: 'https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096'
            });

        const targetChannel = await interaction.client.channels.fetch('1294301892129722389');
        await targetChannel.send({ embeds: [newEmbed] });

        await interaction.channel.send({ 
            content: '<@&1294295806219784192>, <@&1294281837270798336>', 
            embeds: [embed], 
            components: [row] 
        });

        await interaction.reply({ content: 'Early Access Sent.', ephemeral: true });

        const filter = i => i.customId === 'ea' || i.customId === 'howToGetEa';
        const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 9999999 });

        collector.on('collect', async i => {
            if (i.customId === 'ea') {
                if (i.member.roles.cache.has('1294281837270798336') || 
                    i.member.roles.cache.has('1294295806219784192') || 
                    i.member.roles.cache.has('1294335667458932826') ||
                    i.member.roles.cache.has('1294335802658258974') ||
                    i.member.roles.cache.has('1294281703426228345')) { 
                    
                    await i.reply({ content: `**Link:** ${sessionLink}`, ephemeral: true });
                } else {
                    await i.reply({ 
                        content: 'You do not have permission to use this button.', 
                        ephemeral: true 
                    });
                }
            } else if (i.customId === 'howToGetEa') {
                const howToGetEaEmbed = new EmbedBuilder()
                    .setTitle('Get Early Access')
                    .setDescription('To get early access, you can become a Nitro Booster, join the Emergency Services, or become a Content Creator in our community. These roles offer various perks, including early access to sessions. If you are interested, please open a support ticket, and we will guide you through the process.')
                    .setColor(`#7091fd`)
                    .setFooter({
                        text: 'Greenville Extreme',
                        iconURL: 'https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096'
                    });

                await i.reply({ embeds: [howToGetEaEmbed], ephemeral: true });
            }
        });

        collector.on('end', async collected => {
            const logChannel = interaction.guild.channels.cache.get('1294301892129722389');
            if (logChannel) {
                await logChannel.send(`Collected ${collected.size} interactions.`);
            }
        });

        collector.on('error', async error => {
            const logChannel = interaction.guild.channels.cache.get('1294301892129722389');
            if (logChannel) {
                await logChannel.send(`Collector encountered an error: ${error}`);
            }
            console.error('Collector encountered an error:', error);
        });
    },
};
