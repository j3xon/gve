const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'staff') {
                let embedResponses = [];
                let components = [];

                switch (interaction.values[0]) {
                    case 'information_staff':
                        const serverRules = [
                        `Welcome to the Greenville Roleplay Extreme Staffing Department! This is all of our staff information! Everything you will ever need will be here! If you have questions, please ask a staff member. Thank you for being with us and joining our team!
> **Rule 1**: Follow all rules provided by high command, failing to do so would result in a termination.

> **Rule 2**: Fail Roleplay refers to any actions that break the realistic role-playing experience. This includes:
Unrealistic driving (e.g., excessive speeding, reckless driving).
•	Ignoring game mechanics (e.g., not using turn signals, running red lights).
•	Breaking character (e.g., discussing real-world topics irrelevant to the role-play scenario).

> **Rule 3**: Staff Roles and Responsibilities
•	Moderator: Enforce rules, assist players, and handle minor disputes.
•	Admin: Oversee moderators, handle escalated issues, and manage major events.

> **Rule 4**: General Responsibilities:
•	Monitor chat and gameplay for rule violations.
•	Assist players with questions or issues.
•	Report bugs or issues to the leadership team.
•	Participate in and organize events.
•	Maintain professionalism and act as a role model for players.

> **Rule 5**: Behavior
•	Always remain respectful and professional.
•	Do not use your powers for personal gain.
•	Treat all players fairly and without bias.

> **Rule 6**: Communication
•	Use clear and concise language.
•	Report issues promptly to higher-ups.
•	Keep all staff-related discussions confidential.

> **Rule 7**: Disciplinary Actions:
•	Issue warnings for minor offenses.
•	Use temporary bans for repeated or severe offenses.
•	Permanent bans should only be issued by admins or higher with proper justification.


Banned Roleplays Greenville Roleplay Extreme
These Roleplays are banned because 1 they are either too much or people can't control them and there is too much frp going around in the session and it shows a bad look on our server!

Autobahn
Cut-up`
                        ];
                
                        embedResponses = serverRules.map((rule, index) => new EmbedBuilder()
                            .setDescription(rule)
                            .setColor(`#7091fd`)
                        );
                        break;

                    case 'scommands':
                        const serverGuidelines = [
                            `**__Session Commands__**
                            > startup
                            > ea
                            > cohost
                            > release
                            > over`
                            ];
                        
                        embedResponses = serverGuidelines.map((guideline, index) => new EmbedBuilder()
                            .setDescription(guideline)
                            .setColor(`#7091fd`)
                            );
                        break;


                    case 'extra':
                        const affiliateLinksEmbed = new EmbedBuilder()
                            .setTitle('Extra Information')
                            .setDescription('Comming Soon')
                            .setColor(`#7091fd`)
                        
                        embedResponses.push(affiliateLinksEmbed);
                        break;
                }

                await interaction.reply({ embeds: embedResponses, components, ephemeral: true });
            }
        } else if (interaction.isButton()) {
            const roleId1 = '1271091450326814877';
            const member = interaction.member;

            if (interaction.customId === 'toggle_ping' || interaction.customId === 'startup_cm2') {
                if (member.roles.cache.has(roleId1)) {
                    await member.roles.remove(roleId1);
                    await interaction.reply({ content: 'The <@&1271091450326814877> role has been removed from you.', ephemeral: true });
                } else {
                    await member.roles.add(roleId1);
                    await interaction.reply({ content: 'You have been granted the <@&1271091450326814877> role.', ephemeral: true });
                }
            }

        }
    },
};
