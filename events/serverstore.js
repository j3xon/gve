const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isStringSelectMenu()) return;

        const { customId, values } = interaction;

        if (customId === 'perks') {
            const selectedValue = values[0];
            let embeds = [];

            // Different ephemeral messages for each option
            if (selectedValue === 'rp') {
                const rpEmbed = new EmbedBuilder()
                    .setDescription(`**Early Access**: 200 Robux
                        **BVE**: 300 Robux
                        **UBVE**: 400 Robux
                        **Images Permission**: 100 Robux
                        **Custom Role**: 200 Robux`)
                    .setColor(`#7091fd`);

                embeds.push(rpEmbed);
            } else if (selectedValue === 'np') {
                const npEmbed = new EmbedBuilder()
                    .setDescription(`**Boost 1-3 times**
                        Early Access
                        BVE
                        Images Permission
                        10k eco per week
                        
                        **Boost 4+ times**
                        UBVE
                        Custom Role
                        30k eco per week.`)
                    .setColor(`#7091fd`);

                embeds.push(npEmbed);
            } else if (selectedValue === 'mp') {
                // First embed for the perks details
                const mpEmbed = new EmbedBuilder()
                    .setDescription(`
To purchase the perks listed below, kindly reach out to <@783921011317014535> via direct message. Our team is ready to assist you with any inquiries and facilitate your purchase. Thank you for your interest!`)
                    .setColor(`#7091fd`);

                // Second embed for the detailed price list
                const mpDetailsEmbed = new EmbedBuilder()
                    .setDescription(`
                        **Early Access**: $5 per month
                        **BVE**: $10 per month
                        **UBVE**: $15 per month
                        **Images Permission**: $5 per month
                        **Custom Role**: $10 per month`)
                    .setColor(`#7091fd`);

                embeds.push(mpEmbed, mpDetailsEmbed);
            }

            // Send the embeds in one interaction
            await interaction.reply({ embeds, ephemeral: true });
        }
    }
};
