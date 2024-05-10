const Discord = require('discord.js')
const AntiRaidClient = require('../../structure/client');
module.exports = {
    name: "prefix",
    description: "Manages bot prefixes",
    requiredPerms: "owner",
    /**
     * 
     * @param {AntiRaidClient} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {

        const type = args[0] || "list" //action
        const prefix = args[1];

        let data = await client.db.get("prefix_" + message.guildId) || [client.config.prefix]

        if (type === "add") {

            if (data.length >= 5) {
                const tooMuchPrefix = new Discord.EmbedBuilder()
                    .setTitle("[Help] - SetPrefix Module")
                    .setColor(client.color)
                    .setDescription("[\`❌\`] You can't set more than **5** prefix.");

                return message.reply({
                    content: null,
                    embeds: [tooMuchPrefix],
                    allowedMentions: { repliedUser: false }
                });
            }

            if (data.includes(prefix)) {
                const alreadyPrefix = new Discord.EmbedBuilder()
                    .setTitle("[Help] - SetPrefix Module")
                    .setColor(client.color)
                    .setDescription("[\`❌\`] The prefix already exist in the database.");

                return message.reply({
                    content: null,
                    embeds: [alreadyPrefix],
                    allowedMentions: { repliedUser: false }
                });
            }

            if (!prefix) {
                const helpEmbed = new Discord.EmbedBuilder()
                    .setTitle("[Help] - SetPrefix Module")
                    .setColor(client.color)
                    .setDescription("[\`❌\`] You have not enter the prefix to set.");

                return message.reply({
                    content: null,
                    embeds: [helpEmbed],
                    allowedMentions: { repliedUser: false }
                });
            };

            data.push(prefix)            
            await client.db.set("prefix_" + message.guildId, data)

            return message.reply({ 
                content: `Your prefix \`${prefix.replaceAll('`', "").replaceAll("||", "")}\` has been added`,
                allowedMentions: { repliedUser: false }
            });
        } else if (type === "remove") {
            if (!prefix) {
                const helpEmbed = new Discord.EmbedBuilder()
                    .setTitle("[Help] - SetPrefix Module")
                    .setColor(client.color)
                    .setDescription("[\`❌\`] You have not enter the prefix to set.");
                return message.reply({
                    content: null,
                    embeds: [helpEmbed],
                    allowedMentions: { repliedUser: false }
                });
            }

            if (!data.includes(prefix)) {
                const helpNoPrefix = new Discord.EmbedBuilder()
                    .setTitle("[Help] - SetPrefix Module")
                    .setColor(client.color)
                    .setDescription("[\`❌\`] Prefix not found...");
                return message.reply({
                    content: null,
                    embeds: [helpNoPrefix],
                    allowedMentions: { repliedUser: false }
                });
            } else {
                data.shift(x => x === interactionValues[index])
                await client.db.set("prefix_" + message.guildId, data)

                return message.reply({ 
                    content: `Your prefix \`${prefix.replaceAll('`', "").replaceAll("||", "")}\` has been removed`,
                    allowedMentions: { repliedUser: false }
                });
            }
        } else if (type === "reset") {

            data = [client.config.prefix]
            await client.db.set("prefix_" + message.guildId, data)
            return message.reply({ 
                content: `Your prefix has just been reset`,
                allowedMentions: { repliedUser: false }
            });
        }  else {
            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setTitle("Your prefixes")
                .setDescription(`\`\`\`js\n${data.length > 0 ? data.map((data, index) => `${index + 1}・ ${data}`).join('\n') : "No prefix"}\`\`\``)

            message.reply({
                content: null,
                embeds: [embed],
                allowedMentions: { repliedUser: false }
            })
        }
    }
}