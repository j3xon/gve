const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataDirPath = path.join(__dirname, '../../data/vehicleData');
const logChannelId = '1292137181674082327'; // Your log channel ID
const specialRoleId = '1294281890664153118'; // Role ID for 10 vehicle registrations

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register your vehicle.')
        .addIntegerOption(option =>
            option.setName('year')
                .setDescription('Vehicle Year')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('make')
                .setDescription('Vehicle Make')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('model')
                .setDescription('Vehicle Model')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Vehicle Color')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('number-plate')
                .setDescription('Vehicle Number Plate')
                .setRequired(true)),

    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const year = interaction.options.getInteger('year');
            const make = interaction.options.getString('make');
            const model = interaction.options.getString('model');
            const color = interaction.options.getString('color');
            const numberPlate = interaction.options.getString('number-plate');
            const userId = interaction.user.id;

            if (!fs.existsSync(dataDirPath)) {
                fs.mkdirSync(dataDirPath, { recursive: true });
            }

            const userFilePath = path.join(dataDirPath, `${userId}.json`);

            let vehicleData = [];
            if (fs.existsSync(userFilePath)) {
                vehicleData = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
            }

            // Determine vehicle limit based on role
            const vehicleLimit = interaction.member.roles.cache.has(specialRoleId) ? 10 : 5;

            // Check if the user has reached the vehicle registration limit
            if (vehicleData.length >= vehicleLimit) {
                await interaction.editReply({
                    content: `You can only register up to ${vehicleLimit} vehicles. Please deregister a vehicle before adding another.`,
                    ephemeral: true
                });
                return;
            }

            vehicleData.push({ year, make, model, color, numberPlate });

            fs.writeFileSync(userFilePath, JSON.stringify(vehicleData, null, 2), 'utf8');

            await interaction.editReply({
                content: 'Your vehicle has been successfully registered. To view your registered vehicles, please use the `/profile` command.',
                ephemeral: true
            });

            // Send the registration info to the specified channel
            if (interaction.guild) {
                const logChannel = await interaction.guild.channels.fetch(logChannelId);
                if (logChannel) {
                    const registrationMessage = `New Vehicle Registration:\n**User:** <@${userId}>\n**Year:** ${year}\n**Make:** ${make}\n**Model:** ${model}\n**Color:** ${color}\n**Number Plate:** ${numberPlate}`;
                    await logChannel.send(registrationMessage);
                } else {
                    console.error(`Log channel with ID ${logChannelId} not found.`);
                }
            } else {
                console.error('Interaction not in a guild.');
            }

        } catch (error) {
            console.error('Error processing vehicle registration:', error);
            if (!interaction.replied) {
                await interaction.editReply({
                    content: 'An error occurred while processing your request. Please try again later.',
                    ephemeral: true
                });
            }
        }
    },
};
