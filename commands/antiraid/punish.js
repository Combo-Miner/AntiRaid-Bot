const Discord = require('discord.js')
const AntiRaidClient = require('../../structure/client');
module.exports = {
    name: "punish",
    description: "Manage the punish",
    requiredPerms: "owner",
    usage: "punish <kick/ban/tempmute/none>",
    /**
     * 
     * @param {AntiRaidClient} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {


        const type = args[0] || null;
        const acceptedTypes = ["kick", "ban", "tempmute","none"];

        const db = await client.db.get('punish_' + message.guildId) || "none";

        if (!acceptedTypes.includes(type)) return message.channel.send(`The current **Punish** type is **${db.replace("false","none")}** !\nAccepted types: ${acceptedTypes.join(", ")}`);

        if(db === type || type === "none" && db === false) return message.channel.send(`The **Punish** type is already set to **${type}** !`);
        await client.db.set('punish_' + message.guildId, type.replace("none",false));
        return message.channel.send(`The **Punish** type is now set to **${type}** !`);
    }
}