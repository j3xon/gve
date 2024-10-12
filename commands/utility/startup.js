const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startup')
        .setDescription('Sends a startup embed')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addIntegerOption(option =>
            option.setName('reactions')
                .setDescription('Amount of reactions for the session to occur')
                .setRequired(true)),
    async execute(interaction) {
        try {
            // Defer the reply to give the bot time to process
            await interaction.deferReply({ ephemeral: true });

            const reactions = interaction.options.getInteger('reactions');

            const embed = new EmbedBuilder()
                .setTitle('GVE | Session Startup')
                .setDescription(`<@${interaction.user.id}> has initiated a roleplay session. Before the session begins, please ensure that you adhere to the banned vehicle list below and review the server guidelines available at <#1294299028221202464>.

The session will commence once the host receives **__${reactions}__** or more reactions.`)
                .setColor(`#7091fd`)
                .setImage("https://cdn.discordapp.com/attachments/1294341752068767874/1294385520884973588/Session_Startup.png?ex=670ad1f4&is=67098074&hm=3ea9fae09f3b73ce1fe6a9ac82d19cede5167c7cb53fcdcca9681c01917ff419&")
                .setFooter({
                    text: 'Greenville Extreme',
                    iconURL: 'https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096'
                });

            const bannedVehicleButton = new ButtonBuilder()
                .setLabel('Banned Vehicle List')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.com/channels/1294299028221202464/1294312012075241552');

            const row = new ActionRowBuilder()
                .addComponents(bannedVehicleButton);

            // Send the message with @everyone ping
            const message = await interaction.channel.send({
                content: '<@everyone>',
                embeds: [embed],
                components: [row]
            });

            // React to the message with ✅
            await message.react('✅');

            const newEmbed = new EmbedBuilder()
                .setTitle("Session Startup")
                .setDescription(`<@${interaction.user.id}> has started up a session in <#${interaction.channel.id}>.
                
Reaction count required: ${reactions}.`)
                .setColor(`#7091fd`)
                .setThumbnail(`https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096`)
                .setFooter({
                    text: 'Greenville Extreme',
                    iconURL: 'https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096'
                })

            // Send the new embed to the target channel
            const targetChannelId = '1294301892129722389'; // Your target channel ID
            const targetChannel = await interaction.client.channels.fetch(targetChannelId);
            if (targetChannel) {
                await targetChannel.send({ embeds: [newEmbed] });
            } else {
                console.error("Target channel not found or invalid.");
            }

            // Collect reactions
            const filter = (reaction, user) => reaction.emoji.name === '✅' && !user.bot;
            const collector = message.createReactionCollector({ filter, time: 86400000 });

            collector.on('collect', (reaction) => {
                console.log(`Collected ${reaction.count} reactions`);
                if (reaction.count >= reactions) {
                    const settingUpEmbed = new EmbedBuilder()
                        .setDescription('Setting up!')
                        .setColor(`#7091fd`)
                        .setThumbnail("https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096")
                        .setFooter({
                            text: 'Greenville Extreme',
                            iconURL: 'https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096'
                        });

                    interaction.channel.send({ embeds: [settingUpEmbed] });
                    collector.stop();
                }
            });

            collector.on('end', collected => {
                console.log(`Collector ended. Total reactions: ${collected.size}`);
            });

            // Acknowledge the interaction
            await interaction.editReply({ content: 'Startup message sent successfully!', ephemeral: true });

        } catch (error) {
            console.error("An error occurred: ", error);
            if (error.code === 10062) {
                await interaction.followUp({
                    content: "Your request could not be completed due to an unknown interaction.",
                    ephemeral: true
                });
            } else {
                await interaction.followUp({
                    content: "An error occurred while processing your request.",
                    ephemeral: true
                });
            }
        }
    },
};
