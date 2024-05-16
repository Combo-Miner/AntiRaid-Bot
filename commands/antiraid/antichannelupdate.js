const Discord = require('discord.js')
const AntiRaidClient = require('../../structure/client');
module.exports = {
    name: "antichannelupdate",
    description: "Manage the AntiChannelUpdate module",
    requiredPerms: "owner",
    usage: "antichannelupdate <on/off>",
    /**
     * 
     * @param {AntiRaidClient} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {

        const type = args[0] || null;

        const db = await client.db.get('antichannelupdate_' + message.guildId) || false;

        if (type === "on") {
            if (db) return message.channel.send("The **AntiChannelUpdate** module is already **activated** !");
            await client.db.set('antichannelupdate_' + message.guildId, true)
            return message.channel.send("The **AntiChannelUpdate** module is now **activated** !")
        } else if (type === "off") {
            if (!db) return message.channel.send("The **AntiChannelUpdate** module is already **desactivated** !");
            await client.db.set('antichannelupdate_' + message.guildId, false);
            return message.channel.send("The **AntiChannelUpdate** module is now **desactivated** !");
        } else {
            return message.channel.send("The **AntiChannelUpdate** current state is: " + (db ? "**activated** !" : "**desactivated** !"));
        }

    }
}