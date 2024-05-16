const AntiRaidClient = require("../../structure/client")
const Discord = require('discord.js')

module.exports = {
    name: "messageCreate",
    /**
     * @param {AntiRaidClient} client
     * @param {Discord.Message} message
     */
    run: async (client, message) => {
        if (!message.content || !("guild" in message) || !("author" in message) || message.author.bot) return;

        const args = message.content.split(' ');
        const prefix = await client.db.get("prefix_" + message.guild.id) || client.config.prefix;
        const cmd = client.commands.get(args[0].slice(prefix.length));
        if (!cmd) return;
        switch (cmd.requiredPerms) {
            case "owner":
                const dataOwners = ((await client.db.get("owner")) || []).concat(client.config.owners)
                if (!dataOwners.includes(message.author.id) ) return message.reply('❌ You are not authorized to use this command!!')
                break;
            case "buyer":
                if (!client.config.owners.includes(message.author.id)) return message.reply('❌ You are not authorized to use this command!!')
                break;
            default:
                break;
        }

        cmd.run(client, message, args.filter((_, i) => i !== 0)).catch((e) => { console.log(e) })
    }
}