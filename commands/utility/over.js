const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('over')
        .setDescription('Purges messages from today between specified start and end times, excluding pinned ones.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addStringOption(option =>
            option.setName('start-time')
                .setDescription('Start time in HH:MM format')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('end-time')
                .setDescription('End time in HH:MM format')
                .setRequired(true)),
    async execute(interaction) {
        // Check if the command is executed in the specified channel
        if (interaction.channel.id !== '1294300210096373830') {
            return await interaction.reply({
                content: 'This command can only be used in the designated channel.',
                ephemeral: true
            });
        }

        const startTime = interaction.options.getString('start-time');
        const endTime = interaction.options.getString('end-time');

        const now = new Date();
        const start = new Date(now);
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        start.setHours(startHours, startMinutes, 0, 0);

        const end = new Date(now);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        end.setHours(endHours, endMinutes, 0, 0);

        if (start > end) {
            end.setDate(end.getDate() + 1);
        }

        try {
            // Fetch messages from the specified channel
            const messages = await interaction.channel.messages.fetch({ limit: 100 });
            const pinnedMessages = await interaction.channel.messages.fetchPinned(); // Fetch pinned messages
            const pinnedMessageIds = new Set(pinnedMessages.map(msg => msg.id)); // Create a set of pinned message IDs

            const sortedMessages = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

            const messagesToDelete = sortedMessages.filter((msg, index) => {
                const msgDate = new Date(msg.createdTimestamp);
                return index >= 2 && msgDate >= start && msgDate <= end && !pinnedMessageIds.has(msg.id); // Exclude pinned messages
            });

            for (const msg of messagesToDelete.values()) {
                await msg.delete();
            }

            const embed = new EmbedBuilder()
                .setTitle('GVE | Session Over')
                .setDescription(`Thank you for joining the Greenville Extreme session! We hope you had an enjoyable experience throughout the session.
                
                **__Session Details:__**
                Session Host: **<@${interaction.user.id}>**
                Start Time: **${startTime}** 
                End Time: **${endTime}**`)
                .setColor(`#7091fd`)
                .setImage("https://cdn.discordapp.com/attachments/1294341752068767874/1294387859897454612/Session_Startup_3.png?ex=670ad422&is=670982a2&hm=72b9cab589c844008233d7236d856559e53e2ffc1e5cb15c35972ecc6db4d093&")
                .setFooter({
                    text: 'Greenville Extreme',
                    iconURL: 'https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096'
                });

            const newEmbed = new EmbedBuilder()
                .setTitle("Session Over")
                .setDescription(`<@${interaction.user.id}> has ended their session in <#1294300210096373830>. 
                    All information has been provided in the message and session has been logged in the channel this embed has been sent to.`)
                .setColor(`#7091fd`)
                .setThumbnail("https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096")
                .setFooter({
                    text: 'Greenville Extreme',
                    iconURL: 'https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096'
                });

            const targetChannel = await interaction.client.channels.fetch('1294301892129722389');
            await targetChannel.send({ embeds: [newEmbed] });
            await interaction.channel.send({ embeds: [embed] });

            await interaction.reply({ content: 'Command sent below.', ephemeral: true });
        } catch (error) {
            console.error('Error deleting messages:', error);
            await interaction.reply({ content: 'Failed to delete messages. Please try again later.', ephemeral: true });
        }
    },
};
