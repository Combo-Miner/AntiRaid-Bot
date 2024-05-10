
const { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const WhitelistClass = require("../../structure/users/whitelist");
const AntiRaidClient = require("../../structure/client");
module.exports = {
    name: "whitelist",
    description: "Manage the guild whitelist",
    requiredPerms: "owner",
    /**
     * 
     * @param {AntiRaidClient} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @returns 
     */
    run: async (client, message, args) => {
        const type = args[0] || "list" //action
        const userId = message.mentions.members.first() || message.author;

        let data = await client.db.get("whitelist_" + message.guild.id) || []

        if (type === "add") {
            if (data.includes(userId.id)) return message.channel.send(`${userId} is already whitelisted `);
            data.push(userId.id);
            client.db.set("whitelist_" + message.guildId, data);
            message.channel.send(`${userId} has been added to the whitelist`);

        } else if (type === "remove") {
            if (!data.includes(userId.id)) return message.channel.send(`${userId} is not whitelisted`);
            data = data.filter(u => u !== userId.id);
            client.db.set("whitelist_" + message.guildId, data);
            message.channel.send(`${userId} has been removed from the whitelist`);

        } else if (type === "clear") {
            data = [];
            client.db.set("whitelist_" + message.guildId, data);
            return message.channel.send("Whitelist has been cleared");

        } else {
            const whitelist = data;

            let embed = {
                title: "Whitelist",
                color: 0x2fbc,
                description: "",
                footer: {
                    text: "anti-raid.xyz | " + data.length
                }
            };

            if (whitelist.length == 0) {
                embed.description = "No users in whitelist";

            } else if (whitelist.length > 10) {
                embed.description = whitelist.slice(0, 10).map(user => `- <@${user}> (ID: ${user})`).join("\n");

                embed.footer = {
                    text: "Page 1"
                }

                const row = new ActionRowBuilder().addComponents([
                    new ButtonBuilder().setCustomId('prev').setLabel("<").setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('count').setLabel(`1/${Math.ceil(whitelist.length / 10)}`).setStyle(ButtonStyle.Primary).setDisabled(true),
                    new ButtonBuilder().setCustomId('next').setLabel(">").setStyle(ButtonStyle.Primary)])

                const msg = await message.channel.send({ embeds: [embed], components: [row] });

                msg.author.id = message.author.id;
                return manageWhitelist(whitelist, msg, client);
            } else {
                embed.description = whitelist.map(user => `- <@${user}> (ID: ${user})`).join("\n");
            }
            message.channel.send({ embeds: [embed] });
        }
    }
}


async function manageWhitelist(data, message, client) {
    //each embed we gonna show 10 users

    let embeds = [];
    let users = [];
    let currentIndex = 0;
    for (let i = 0; i < data.length; i++) {
        users.push(data[i]);
        if (users.length === 10) {
            embeds.push({
                title: "Whitelist",
                color: 0x2fbc,
                description: users.map(user => `- <@${user}> (ID: ${user})`).join("\n"),
                footer: {
                    text: "anti-raid.xyz | " + data.length
                }
            });
            users = [];
        }
    }
    if (users.length > 0) {
        embeds.push({
            title: "Whitelist",
            color: 0x2fbc,
            description: users.map(user => `- <@${user}> (ID: ${user})`).join("\n"),
            footer: {
                text: "anti-raid.xyz | " + data.length
            }
        });
    }

    const collector = message.createMessageComponentCollector(client, {
        time: 60000
    })

    collector.on("collect", async (i) => {
        if (i.user.id !== message.author.id) {
            return i.reply({
                content: "You are not authorized to use this interaction!",
                flags: 64
            })
        }
        collector.resetTimer()
        if (i.customId === "next") {
            currentIndex++;
            if (currentIndex > embeds.length - 1) currentIndex = 0;
            i.message.components = i.message.components.map(r => {
                r.components.map(ch => {
                    if (ch.data.custom_id === "count") {
                        ch.data.label = currentIndex + 1 + "/" + embeds.length;
                    }
                    return ch;
                })
                return r;
            })
            i.update({ embeds: [embeds[currentIndex]], components: i.message.components });
        } else if (i.customId === "prev") {
            currentIndex--;
            if (currentIndex < 0) currentIndex = embeds.length - 1;
            i.message.components = i.message.components.map(r => {
                r.components.map(ch => {
                    if (ch.data.custom_id === "count") {
                        ch.data.label = currentIndex + 1 + "/" + embeds.length;
                    }
                    return ch;
                })
                return r;
            })
            i.update({ embeds: [embeds[currentIndex]], components: i.message.components });
        }
    })

}