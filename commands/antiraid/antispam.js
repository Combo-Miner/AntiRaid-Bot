const Discord = require('discord.js')
const AntiRaidClient = require('../../structure/client');
module.exports = {
    name: "antispam",
    description: "Manage the antispam module",
    requiredPerms: "owner",
    /**
     * 
     * @param {AntiRaidClient} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {

        const type = args[0] || null;

        const db = await client.db.get('antispam_' + message.guildId) || false;

        if (type === "on") {
            if (db) return message.channel.send("The **Antispam** module is already **activated** !");
            await client.db.set('antispam_' + message.guildId, true)
            return message.channel.send("The **Antispam** module is now **activated** !")
        } else if (type === "off") {
            if (!db) return message.channel.send("The **Antispam** module is already **desactivated** !");
            await client.db.set('antispam_' + message.guildId, false);
            return message.channel.send("The **Antispam** module is now **desactivated** !")

        } else {
            return message.channel.send("The **Antispam** current state is: " + (db ? "**activated** !" : "**desactivated** !"));
        }

    }
}