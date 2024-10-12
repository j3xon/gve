const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, EmbedBuilder } = require('discord.js');
const moment = require('moment'); // Moment.js to format the date

module.exports = {
    data: new SlashCommandBuilder()
        .setName('strike')
        .setDescription('Add a mark role to a user and notify them.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to mark')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for marking the user')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('evidence')
                .setDescription('evidence for marking the user')
                .setRequired(true)),
    
    async execute(interaction) {
        await interaction.deferReply(); // Acknowledge the interaction upfront

        const targetUser = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');
        const evidence = interaction.options.getString('evidence') || 'No evidence provided.';
        
        const roles = {
            firstStrike: '1294340334699937933',
            secondStrike: '1294340397232816269',
            thirdStrike: '1294340429893865584',
            finalRole: '1294340466413928458'
        };

        const guild = interaction.guild;
        const member = guild.members.cache.get(targetUser.id);

        const currentDate = moment().format('MMMM Do YYYY, h:mm:ss a');

        const markDmEmbed = new EmbedBuilder()
            .setTitle('You Have Been Marked')
            .setDescription(`You have been marked in **${guild.name}** by <@${interaction.user.id}>.`)
            .addFields(
                { name: 'Reason', value: reason, inline: true },
                { name: 'Evidence', value: evidence, inline: true },
                { name: 'Date', value: currentDate, inline: true }
            )
            .setColor(`#7091fd`)
            .setThumbnail("https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096")
            .setFooter({
                text: 'Greenville Extreme',
                iconURL: 'https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096'
            });

        const suspensionDmEmbed = new EmbedBuilder()
            .setTitle('Suspension Notice')
            .setDescription(`Due to having 3 strikes, you have been suspended from **${guild.name}**.`)
            .addFields(
                { name: 'Reason for Suspension', value: reason, inline: true },
                { name: 'Evidence', value: evidence, inline: true },
                { name: 'Date', value: currentDate, inline: true }
            )
            .setColor(`#7091fd`)
            .setThumbnail("https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096")
            .setFooter({
                text: 'Greenville Extreme',
                iconURL: 'https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096'
            });

        try {
            if (member.roles.cache.has(roles.thirdStrike)) {
                await member.roles.set([]);
                await member.roles.add(roles.finalRole);
                await targetUser.send({ embeds: [suspensionDmEmbed] });

                return interaction.editReply({ content: `${targetUser.username} already has 3 strikes. All roles have been removed, and they have been given the final role. A suspension notice has been sent to them.`, ephemeral: true });
            } else if (member.roles.cache.has(roles.secondStrike)) {
                await member.roles.add(roles.thirdStrike);
            } else if (member.roles.cache.has(roles.firstStrike)) {
                await member.roles.add(roles.secondStrike);
            } else {
                await member.roles.add(roles.firstStrike);
            }

            await targetUser.send({ embeds: [markDmEmbed] });
            const logEmbed = new EmbedBuilder()
                .setTitle('User Marked')
                .addFields(
                    { name: 'User', value: `${targetUser.tag}`, inline: true },
                    { name: 'Reason', value: reason, inline: true },
                    { name: 'Evidence', value: evidence, inline: true },
                    { name: 'Marked by', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Date', value: currentDate, inline: true }
                )
                .setColor(`#7091fd`)
                .setThumbnail("https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096")
                .setFooter({
                    text: 'Greenville Extreme',
                    iconURL: 'https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096'
                });

            await interaction.editReply({ content: `<@${targetUser.id}> has been marked for: ${reason},\n Evidence: ${evidence}`, ephemeral: true });

            const logChannel = guild.channels.cache.get('1294301892129722389');
            if (logChannel) {
                logChannel.send({ embeds: [logEmbed] });
            }
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: 'An error occurred while processing the command.', ephemeral: true });
        }
    },
};
