const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ComponentType, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reinvites')
        .setDescription('Sends reinvites for people to rejoin.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addStringOption(option =>
            option.setName('session-link')
                .setDescription('Link for the session so that civilians may join.')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const sessionLink = interaction.options.getString('session-link');
            const embed = new EmbedBuilder()
                .setTitle('GVE | Session Reinvites')
                .setDescription(`The session host has released reinvites. Click on the button below to get the session link. Note that leaking the session would result in a server ban.
                    
                    **Session Information:**
                    Host: <@${interaction.user.id}>`)
.setColor(`#7091fd`)
.setImage("https://cdn.discordapp.com/attachments/1294341752068767874/1294389076664914011/Session_Startup_4.png?ex=670ad544&is=670983c4&hm=5732cd326b7c790b52be2d032454a671db61525f7a244244a53bd3fd1677edac&")
.setFooter({
    text: 'Greenville Extreme',
    iconURL: 'https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096'
});
            const button = new ButtonBuilder()
                .setLabel('Session Link')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('ls');

            const row = new ActionRowBuilder()
                .addComponents(button);

            const newEmbed = new EmbedBuilder()
                .setTitle("Session Reinvites")
                .setDescription(`<@${interaction.user.id}> has released reinvites in <#${interaction.channel.id}>`)
                .setColor(`#7091fd`)
                .setThumbnail("https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096")
                .setFooter({
                    text: 'Greenville Extreme',
                    iconURL: 'https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096'
                });

            const logChannel = await interaction.client.channels.fetch('1294301892129722389');
            await logChannel.send({ embeds: [newEmbed] });

            await interaction.channel.send({ content: '@here, <@&1294330207456723085>', embeds: [embed], components: [row] });

            await interaction.reply({ content: 'You have successfully released the session.', ephemeral: true });

            const filter = i => i.customId === 'ls';
            const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.BUTTON, time: 9999999 });

            collector.on('collect', async i => {
                try {
                    await i.deferUpdate();

                    await i.followUp({ content: `**Link:** ${sessionLink}`, ephemeral: true });

                    const logEmbed = new EmbedBuilder()
                        .setTitle(`Session Link Button`)
                        .setDescription(`Button clicked by <@${i.user.id}>. Session link in <#${interaction.channel.id}>`)
                        .setColor(`#7091fd`)
                        .setThumbnail("https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096")
                        .setFooter({
                            text: 'Greenville Extreme',
                            iconURL: 'https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096'
                        });
        
                        
                    await logChannel.send({ embeds: [logEmbed] });
                } catch (error) {
                    console.error('Error responding to interaction:', error);
                }
            });

            collector.on('end', collected => {
                console.log(`Collected ${collected.size} interactions.`);
            });
        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
        }
    },
};
