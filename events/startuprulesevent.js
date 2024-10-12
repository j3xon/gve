const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isStringSelectMenu()) return;

        const { customId, values, member } = interaction;

        if (customId === 'session_options') {
            const selectedValue = values[0];

            if (selectedValue === 'law') {
                // Create an embed with a comprehensive list of laws
                const lawEmbed = new EmbedBuilder()
                    .setTitle('Roleplay Laws')
                    .setDescription(`
**List of Laws:**

- Failure to Stop at a Red Light
- Failure to Signal
- Speeding
- Hit and Run
- Driving Under the Influence
- Vehicular Manslaughter
- Street Racing
- Driving on the Wrong Side of the Road
- Driving without a License
- Using a Mobile Phone While Driving
- Failure to Yield to Pedestrians
- Driving an Unroadworthy Vehicle
- Leaving the Scene of an Accident
- Resisting Arrest
- Possession of Stolen Property
- Disturbing the Peace
- Trespassing
- Vandalism
- Armed Robbery
- Carjacking
- Loitering
- Fraud
- Bribery
- Breaking and Entering
- Forgery
- Public Intoxication
- Obstruction of Justice
- Littering
- Unlawful Assembly
- Carrying a Concealed Weapon without a Permit
- Kidnapping
- Arson
- Extortion
                    `)
                    .setColor('#7091fd');

                // Send the embed as an ephemeral response
                await interaction.reply({ embeds: [lawEmbed], ephemeral: true });
            } else if (selectedValue === 'reinvites_ping') {
                const roleId = '1288474315733340180';
                if (member.roles.cache.has(roleId)) {
                    await member.roles.remove(roleId);
                    await interaction.reply({ content: 'Reinvites Ping role removed.', ephemeral: true });
                } else {
                    await member.roles.add(roleId); // Fixed the missing dot here
                    await interaction.reply({ content: 'Reinvites Ping role added.', ephemeral: true });
                }
            } else if (selectedValue === 'session_ping') {
                const roleId = '1294330207456723085';
                if (member.roles.cache.has(roleId)) {
                    await member.roles.remove(roleId);
                    await interaction.reply({ content: `<@&1294330207456723085> has been removed successfully`, ephemeral: true });
                } else {
                    await member.roles.add(roleId); // Fixed the missing dot here
                    await interaction.reply({ content: `<@&1294330207456723085> has been given successfully.`, ephemeral: true });
                }
            }
        }
    }
};
