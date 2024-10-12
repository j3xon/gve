const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            // Define the channel ID for the welcome message
            const channel = member.guild.channels.cache.get('1294550578231377930');
            if (!channel) {
                console.error("Welcome channel not found.");
                return;
            }

            // Create an embed message
            const welcomeEmbed = new EmbedBuilder()
                .setColor(`#7091fd`)
                .setTitle('Welcome')
                .setDescription(`
Welcome to Greenville Roleplay Extreme, <@${member.user.id}>! To gain access to the roleplay server, please proceed to <#1294298528897695797> to verify your account.

**After Verification**  
Once you have completed the verification process, head over to <#1294299028221202464> to review the essential server information.`)
                .setThumbnail(member.user.displayAvatarURL())
                .setImage("https://cdn.discordapp.com/attachments/1294341752068767874/1294551048681295912/Session_Startup_5.png?ex=670b6c1d&is=670a1a9d&hm=bdbe98ca3ce47fbc8eaf2423da00460fbac17609abf1668471197eba17e15290&")
                .setTimestamp()
                .setFooter({ text: 'Greenville Roleplay Extreme', iconURL: member.guild.iconURL() });

            // Send the embed message to the channel
            await channel.send({ embeds: [welcomeEmbed] });
        } catch (error) {
            console.error("Error sending welcome message: ", error);
        }
    }
};
