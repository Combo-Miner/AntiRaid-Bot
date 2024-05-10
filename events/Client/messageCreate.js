const AntiRaidClient = require("../../structure/client")
const Discord = require('discord.js')
const OwnerClass = require("../../structure/users/owners")

module.exports = {
    name: "messageCreate",
    /**
     * @param {AntiRaidClient} client
     * @param {Discord.Message} message
     */
    run: async (client, message) => {
        if (!message.content || !("guild" in message) || !("author" in message) || message.author.bot) return;

        const args = message.content.split(' ');
        const db = await client.db.get("prefix_" + message.guild.id)
        const dbPrefixes = db && db.length === 0  ? await client.db.set("prefix_"+ message.guildId, [client.config.prefix]) : db;
        const prefixUsed = dbPrefixes.find(prefix => message.content.startsWith(prefix.toLowerCase()));
        if (!prefixUsed) return;
        const cmd = client.commands.get(args[0].slice(prefixUsed.length));
        if (!cmd) return;
        switch (cmd.requiredPerm) {
            case "owner":
                const dataOwners = (await client.db.get("owners"))?.owUsers || client.config.owners;
                if (!dataOwners.includes(message.author.id) || !client.config.owners.includes(message.author.id)) return message.reply('❌ You are not authorized to use this command!!')
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