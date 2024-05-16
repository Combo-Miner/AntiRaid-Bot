const Discord = require('discord.js')
const AntiRaidClient = require('../../structure/client');
module.exports = {
    name: "help",
    description: "Get help with the bot",
    requiredPerms: "user",
    /**
     * 
     * @param {AntiRaidClient} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const commands = [...client.commands.values()];
        const prefix = client.config.prefix;
        const embed = new Discord.EmbedBuilder()
        .setColor(client.color)
        .setTitle('Help')
        .setDescription(commands.map(c => `\`${prefix}${c.name}\` \n${c.description} -\n Usage: ${c.usage ?? c.name}`).join('\n'))

        message.channel.send({
            embeds: [embed]
        })
    }
}