const { EmbedBuilder } = require('discord.js');

let lastCheckedMessageId = null;

module.exports = {
    name: 'ready',
    async execute(client) {
        const channelId = '1294439075847209040';
        const channel = await client.channels.fetch(channelId);

        // Check for mentions every 2 seconds
        setInterval(async () => {
            // Fetch the last message in the channel
            const messages = await channel.messages.fetch({ limit: 1 });
            const lastMessage = messages.first();

            // Check if the last message is a mention and is new
            if (lastMessage && lastMessage.id !== lastCheckedMessageId) {
                if (lastMessage.mentions.everyone) {
                    const embed = new EmbedBuilder()
                        .setColor(0x7091fd)
                        .setTitle('Mute Channel.')
                        .setThumbnail(`https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096`)
                        .setDescription(`Wish not to be pinged? You can just mute the channel.`)

                    await channel.send({ embeds: [embed] });
                } else if (lastMessage.mentions.has(channel.guild.members.me)) {
                    const embed = new EmbedBuilder()
                    .setColor(0x7091fd)
                    .setTitle('Mute Channel.')
                    .setThumbnail(`https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096`)
                    .setDescription(`Wish not to be pinged? You can just mute the channel.`);

                    await channel.send({ embeds: [embed] });
                }

                // Update the last checked message ID
                lastCheckedMessageId = lastMessage.id;
            }
        }, 2000); // Check every 2 seconds
    },
};
