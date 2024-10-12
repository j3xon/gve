const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const transcriptDir = './transcripts';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('collect')
        .setDescription('Collect all transcripts and send them to your DMs.'),
    async execute(interaction) {
        const logChannelId = '1294301892129722389'; // Log channel ID
        const logChannel = interaction.guild.channels.cache.get(logChannelId);

        // Check if the user has admin permissions
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        try {
            const transcriptFiles = fs.readdirSync(transcriptDir);
            if (transcriptFiles.length === 0) {
                return interaction.reply({ content: 'There are no transcripts to collect.', ephemeral: true });
            }

            // Create an archive or zip if needed, but here we will just send the files
            const attachments = transcriptFiles.map(file => {
                return {
                    attachment: path.join(transcriptDir, file),
                    name: file
                };
            });

            await interaction.user.send({ content: 'Here are all the collected transcripts:', files: attachments });
            await interaction.reply({ content: 'Transcripts have been sent to your DMs.', ephemeral: true });

            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setTitle('Transcripts Collected')
                    .setDescription(`Transcripts have been collected and sent to ${interaction.user.tag} (${interaction.user.id}).`)
                    .setColor(`#7091fd`);
                await logChannel.send({ embeds: [logEmbed] });
            }
        } catch (error) {
            console.error(error);
            if (logChannel) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Error in Collecting Transcripts')
                    .setDescription(`An error occurred: ${error.message}`)
                    .setColor(`#ff0000`);
                await logChannel.send({ embeds: [errorEmbed] });
            }
            await interaction.reply({ content: 'An error occurred while collecting transcripts.', ephemeral: true });
        }
    },
};
