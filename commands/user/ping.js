const Discord = require('discord.js')
const AntiRaidClient = require('../../structure/client');
module.exports = {
    name: "ping",
    description: "Returns the bot's ping",
    requiredPerms: "user",
    /**
     * 
     * @param {AntiRaidClient} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const now = Date.now();
        const msg = await message.channel.send('Loading...');
        const finish = Date.now() - now;

        const embed = new Discord.EmbedBuilder()
        .setColor(client.color)
        .setTitle('Speed')
        .addFields({
            name: "Bot Latency",
            inline: true,
            value: `\`${finish}ms\``
        }, {
            name: "API latency",
            inline: true,
            value: `\`${client.ws.ping}ms\``
        })

        await msg.edit({
            embeds: [embed],
            content: null
        })
    }
}