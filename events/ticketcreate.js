const { Events, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');

const transcriptDir = './transcripts';
if (!fs.existsSync(transcriptDir)) {
    fs.mkdirSync(transcriptDir, { recursive: true });
}

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const logChannelId = '1294301892129722389'; // Log channel ID
        const logChannel = interaction.guild.channels.cache.get(logChannelId);

        try {
            // Handle String Select Menus
            if (interaction.isStringSelectMenu()) {
                if (interaction.customId === 'ticket_select') {
                    await interaction.deferReply({ ephemeral: true });
                    const selectedOption = interaction.values[0];
                    let ticketChannel;
                    let ticketDescription = '';

                    const generalStaffRoleId = '1294281703426228345'; 
                    const staffReportRoleId = '1294281454376980540'; 

                    const generalStaffRole = interaction.guild.roles.cache.get(generalStaffRoleId);
                    const staffReportRole = interaction.guild.roles.cache.get(staffReportRoleId);

                    if (!generalStaffRole || !staffReportRole) {
                        throw new Error(`One of the roles with IDs ${generalStaffRoleId} or ${staffReportRoleId} not found`);
                    }

                    const categoryID = '1294298971392704605'; 
                    const openTime = Math.floor(Date.now() / 1000);

                    ticketChannel = await interaction.guild.channels.create({
                        name: `${selectedOption}-${interaction.user.username}`,
                        type: ChannelType.GuildText,
                        parent: categoryID,
                        topic: `Created by: ${interaction.user.id} | Opened at: ${openTime}`,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                            },
                            {
                                id: selectedOption === 'staff_report' ? staffReportRole.id : generalStaffRole.id,
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                            },
                        ],
                    });

                    ticketDescription = `Thank you for submitting a ${selectedOption.replace('_', ' ')} ticket. Our staff team will reach back to you shortly.
                    
                    Open Time: <t:${openTime}:f>.`;

                    const ticketEmbed = new EmbedBuilder()
                        .setTitle('GVE | Server Support')
                        .setThumbnail("https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096")
                        .setDescription(ticketDescription)
                        .setColor(0x7091fd);

                    const closeButton = new ButtonBuilder()
                        .setCustomId('close_ticket')
                        .setLabel('🔒 Close Ticket')
                        .setStyle(ButtonStyle.Danger);

                    const buttonRow = new ActionRowBuilder()
                        .addComponents(closeButton);

                    await ticketChannel.send({ 
                        content: `${interaction.user}, <@&${selectedOption === 'staff_report' ? staffReportRoleId : generalStaffRoleId}>`, 
                        embeds: [ticketEmbed], 
                        components: [buttonRow] 
                    });

                    if (logChannel) {
                        const logEmbed = new EmbedBuilder()
                            .setTitle('Ticket Created')
                            .setDescription(`Ticket created by ${interaction.user} (${interaction.user.id})`)
                            .addFields(
                                { name: 'Ticket Type', value: selectedOption },
                                { name: 'Ticket Channel', value: ticketChannel ? ticketChannel.toString() : 'Unknown' },
                                { name: 'Open Time', value: `<t:${openTime}:f>` }
                            )
                            .setColor(0x7091fd);
                        await logChannel.send({ embeds: [logEmbed] });
                    }

                    await interaction.editReply({ content: `Ticket created: ${ticketChannel}` });
                }
            }

            else if (interaction.isButton()) {
                const channelTopic = interaction.channel.topic || '';
                const openTimeStr = channelTopic.split(' | ')[1]?.split('Opened at: ')[1];
                const openTime = openTimeStr ? parseInt(openTimeStr) : Math.floor(Date.now() / 1000); 
                const closeTime = Math.floor(Date.now() / 1000);

                if (interaction.customId === 'close_ticket') {
                    await interaction.reply({ 
                        content: 'Are you sure you want to close this ticket?',
                        ephemeral: true,
                        components: [
                            new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId('close_ticket_final')
                                    .setLabel('🔒 Final Close')
                                    .setStyle(ButtonStyle.Danger)
                            )
                        ]
                    });
                }

                if (interaction.customId === 'close_ticket_final') {
                    await interaction.deferUpdate(); // Deferring the interaction response

                    // Get the transcript of the ticket channel
                    const transcriptFilePath = await createTranscript(interaction.channel);

                    // Create an embed to send to the user
                    const transcriptEmbed = new EmbedBuilder()
                        .setTitle('GVE | Ticket Closed')
                        .setThumbnail("https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096")
                        .setDescription(`Thank you for opening a ticket, we hope our staff team was able to help you with your issue. Please find above the transcript to your ticket.`)
                        .setFields(
                            { name: 'Open Time:⏲️', value: `<t:${openTime}:f>` },
                            { name: 'Close Time⏲️:', value: `<t:${closeTime}:f>` }
                        )                        
                        .setColor(0x7091fd);

                    // Send the embed and the transcript file to the user
                    try {
                        await interaction.user.send({ embeds: [transcriptEmbed], files: [transcriptFilePath] });
                        await interaction.channel.send({ embeds: [transcriptEmbed], files: [transcriptFilePath] }); // Optional: Send transcript to the ticket channel as well
                    } catch (error) {
                        console.error('Error sending transcript:', error);
                    }

                    // Delete the ticket channel after a set time (e.g., 5 seconds)
                    setTimeout(async () => {
                        await interaction.channel.delete();
                    }, 5000);
                }

                if (interaction.customId === 'transcript_ticket') {
                    await interaction.deferUpdate();
                    // Get the transcript of the ticket channel
                    const transcriptFilePath = await createTranscript(interaction.channel);

                    // Create an embed to send to the user
                    const transcriptEmbed = new EmbedBuilder()
                    .setTitle('GVE | Ticket Closed')
                    .setThumbnail("https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096")
                    .setDescription(`Thank you for opening a ticket, we hope our staff team was able to help you with your issue. Please find above the transcript to your ticket.`)
                    .setFields(
                        { name: 'Open Time:⏲️', value: `<t:${openTime}:f>` },
                        { name: 'Close Time⏲️:', value: `<t:${closeTime}:f>` }
                    )                        
                    .setColor(0x7091fd);

                    // Send the embed and the transcript file to the user
                    try {
                        await interaction.user.send({ embeds: [transcriptEmbed], files: [transcriptFilePath] });
                    } catch (error) {
                        console.error('Error sending transcript:', error);
                    }
                }
            }
        } catch (error) {
            console.error('Error in ticket create interaction:', error);
            await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
        }
    },
};

// Function to create the transcript
async function createTranscript(channel) {
    const messages = await channel.messages.fetch({ limit: 100 });
    const transcriptFilePath = path.join(transcriptDir, `${channel.name}-transcript.html`);

    let htmlContent = `
    <html>
        <head>
            <title>Transcript for ${channel.name}</title>
            <style>
                body {
                    background-color: #36393f; /* Discord gray */
                    color: #ffffff;
                    font-family: Arial, sans-serif;
                }
                .message {
                    margin: 10px;
                    padding: 5px;
                    border-radius: 5px;
                }
                .user {
                    font-weight: bold;
                }
                .bot {
                    color: #7289da; /* Bot color */
                }
                .pfp {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    margin-right: 10px;
                }
            </style>
        </head>
        <body>
            <h2>Transcript for ${channel.name}</h2>
            <div id="messages">
    `;

    messages.forEach(message => {
        const avatarUrl = message.author.displayAvatarURL({ format: 'png', dynamic: true });
        const authorClass = message.author.bot ? 'bot' : 'user';
        
        htmlContent += `
            <div class="message">
                <img class="pfp" src="${avatarUrl}" alt="${message.author.username}'s Avatar">
                <span class="${authorClass}">${message.author.username}:</span> ${message.content}
            </div>
        `;
    });

    htmlContent += `
            </div>
        </body>
    </html>
    `;

    fs.writeFileSync(transcriptFilePath, htmlContent, 'utf-8');
    return transcriptFilePath;
}
