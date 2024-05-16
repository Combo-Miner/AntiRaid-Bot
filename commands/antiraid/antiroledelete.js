const Discord = require('discord.js')
const AntiRaidClient = require('../../structure/client');
module.exports = {
    name: "antiroledelete",
    description: "Manage the antiroledelete module",
    requiredPerms: "owner",
    usage: "antiroledelete <on/off>",
    /**
     * 
     * @param {AntiRaidClient} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {

        const type = args[0] || null;

        const db = await client.db.get('antiroledelete_' + message.guildId) || false;

        if (type === "on") {
            if (db) return message.channel.send("The **AntiRoleDelete** module is already **activated** !");
            await client.db.set('antiroledelete_' + message.guildId, true)
            return message.channel.send("The **AntiRoleDelete** module is now **activated** !")
        } else if (type === "off") {
            if (!db) return message.channel.send("The **AntiRoleDelete** module is already **desactivated** !");
            await client.db.set('antiroledelete_' + message.guildId, false);
            return message.channel.send("The **AntiRoleDelete** module is now **desactivated** !")

        } else {
            return message.channel.send("The **AntiRoleDelete** current state is: " + (db ? "**activated** !" : "**desactivated** !"));
        }

    }
}