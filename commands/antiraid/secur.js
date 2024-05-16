const Discord = require('discord.js')
const AntiRaidClient = require('../../structure/client');
module.exports = {
    name: "secur",
    description: "Get info about the current security settings",
    requiredPerms: "owner",
    usage: "secur",
    /**
     * 
     * @param {AntiRaidClient} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {


        const modules = ["antichanneldelete", "antiroledelete", "antichannelupdate", "antiroleupdate", "antilink", "antispam","punish"];

        const [antichanneldelete, antiroledelete, antichannelupdate, antiroleupdate, antilink, antispam,punish] = await Promise.all(modules.map(async module => {
            return await client.db.get(module + "_" + message.guildId) || false;
        }));

        const embed = new Discord.EmbedBuilder()
            .setTitle("Security settings")
            .addFields({
                name: "AntiChannelDelete",
                value: antichanneldelete ? "✅" : "❌"
            }, {
                name: "AntiRoleDelete",
                value: antiroledelete ? "✅" : "❌"
            }, {
                name: "AntiChannelUpdate",
                value: antichannelupdate ? "✅" : "❌"
            }, {
                name: "AntiRoleUpdate",
                value: antiroleupdate ? "✅" : "❌"
            }, {
                name: "AntiLink",
                value: antilink ? "✅" : "❌"
            }, {
                name: "AntiSpam",
                value: antispam ? "✅" : "❌"
            },{
                name: "Punishment",
                value: punish !== null ? punish.toString().replace("false","none") : "none"
            })
            .setColor(client.color)
            .setFooter({
                text: "anti-raid.xyz"
            })
        
        message.channel.send({embeds : [embed]});
    }
}