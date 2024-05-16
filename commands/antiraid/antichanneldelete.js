const Discord = require('discord.js')
const AntiRaidClient = require('../../structure/client');
module.exports = {
    name: "antichanneldelete",
    description: "Manage the antichanneldelete module",
    requiredPerms: "owner",
    usage: "antichanneldelete <on/off>",
    /**
     * 
     * @param {AntiRaidClient} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {

        const type = args[0] || null;

        const db = await client.db.get('antichanneldelete_' + message.guildId) || false;

        if (type === "on") {
            if (db) return message.channel.send("The **AntiChannelDelete** module is already **activated** !");
            await client.db.set('antichanneldelete_' + message.guildId, true)
            return message.channel.send("The **AntiChannelDelete** module is now **activated** !")
        } else if (type === "off") {
            if (!db) return message.channel.send("The **AntiChannelDelete** module is already **desactivated** !");
            await client.db.set('antichanneldelete_' + message.guildId, false);
            return message.channel.send("The **AntiChannelDelete** module is now **desactivated** !")

        } else {
            return message.channel.send("The **AntiChannelDelete** current state is: " + (db ? "**activated** !" : "**desactivated** !"));
        }

    }
}