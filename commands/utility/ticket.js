const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

const ticketsDirPath = path.join(__dirname, '../../data/tickets');

// Ensure the tickets directory exists
if (!fs.existsSync(ticketsDirPath)) {
    fs.mkdirSync(ticketsDirPath, { recursive: true });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Create a new ticket.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user for whom the ticket is being created.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('offense')
                .setDescription('The offense for the ticket')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('price')
                .setDescription('The price for the ticket')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('The count for the ticket')
                .setRequired(true)),

    async execute(interaction) {
        // Role IDs that are allowed to use this command
        const allowedRoleIds = ['1294335802658258974', '1294335667458932826'];

        // Check if the user has one of the allowed roles
        const hasRole = interaction.member.roles.cache.some(role => allowedRoleIds.includes(role.id));

        if (!hasRole) {
            const embed = new EmbedBuilder()
                .setTitle('Role Not Found')
                .setDescription('You do not have permission to use this command.')
                .setColor('#FF0000'); // Red color for error

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const offense = interaction.options.getString('offense');
        const price = interaction.options.getInteger('price');
        const count = interaction.options.getInteger('count');
        const userId = user.id;

        const ticketFilePath = path.join(ticketsDirPath, `${userId}.json`);

        try {
            // Prepare the ticket data
            const ticketData = {
                offense,
                price,
                count,
                date: new Date()
            };

            // Load existing tickets if they exist, else start a new array
            let tickets = [];
            if (fs.existsSync(ticketFilePath)) {
                try {
                    tickets = JSON.parse(fs.readFileSync(ticketFilePath, 'utf8'));
                } catch (readError) {
                    console.error('Error reading the ticket file:', readError);
                    return interaction.reply({ content: 'Failed to read existing tickets. Please try again later.', ephemeral: true });
                }
            }

            // Add new ticket
            tickets.push(ticketData);

            // Write the updated tickets array to the file
            try {
                fs.writeFileSync(ticketFilePath, JSON.stringify(tickets, null, 2), 'utf8');
            } catch (writeError) {
                console.error('Error writing the ticket file:', writeError);
                return interaction.reply({ content: 'Failed to save the ticket. Please try again later.', ephemeral: true });
            }

            const replyEmbed = new EmbedBuilder()
                .setTitle('Ticket Created')
                .setDescription(`The ticket for <@${userId}> has been created successfully.`)
                .addFields(
                    { name: 'Offense', value: offense, inline: true },
                    { name: 'Price', value: price.toString(), inline: true },
                    { name: 'Count', value: count.toString(), inline: true }
                )
                .setColor('#f1efef');

            // Fetch the target channel and send the embed
            const targetChannelId = '1294301892129722389';
            const targetChannel = interaction.client.channels.cache.get(targetChannelId);

            if (!targetChannel) {
                return interaction.reply({ content: 'Target channel not found!', ephemeral: true });
            }

            // Acknowledge the interaction immediately
            await interaction.reply({ content: 'Creating ticket...', ephemeral: true });

            // Send the embed to the target channel
            await targetChannel.send({ embeds: [replyEmbed] });

            // Inform the user the ticket has been created and sent to the channel
            await interaction.followUp({ content: 'Ticket created and sent to the channel.', ephemeral: true });
        } catch (error) {
            console.error('Error executing the ticket command:', error);
            // Make sure to acknowledge the error without trying to reply again
        }
    },
};
