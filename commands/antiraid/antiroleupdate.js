const Discord = require('discord.js')
const AntiRaidClient = require('../../structure/client');
module.exports = {
    name: "antiroleupdate",
    description: "Manage the antiroleUpdate module",
    requiredPerms: "owner",
    usage: "antiroleupdate <on/off>",
    /**
     * 
     * @param {AntiRaidClient} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {

        const type = args[0] || null;

        const db = await client.db.get('antiroleupdate_' + message.guildId) || false;

        if (type === "on") {
            if (db) return message.channel.send("The **AntiRoleUpdate** module is already **activated** !");
            await client.db.set('antiroleupdate_' + message.guildId, true)
            return message.channel.send("The **AntiRoleUpdate** module is now **activated** !")
        } else if (type === "off") {
            if (!db) return message.channel.send("The **AntiRoleUpdate** module is already **desactivated** !");
            await client.db.set('antiroleupdate_' + message.guildId, false);
            return message.channel.send("The **AntiRoleUpdate** module is now **desactivated** !");
        } else {
            return message.channel.send("The **AntiRoleUpdate** current state is: " + (db ? "**activated** !" : "**desactivated** !"));
        }

    }
}