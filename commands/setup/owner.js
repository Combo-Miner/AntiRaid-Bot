
const { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const AntiRaidClient = require("../../structure/client");
module.exports = {
    name: "owner",
    description: "Manage the bot owners",
    requiredPerms: "buyer",
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

        let data = await client.db.get("owner") || []

        if (type === "add") {
            if (data.includes(userId.id)) return message.channel.send(`${userId} is already Ownered `);
            data.push(userId.id);
            client.db.set("owner", data);
            message.channel.send(`${userId} has been added to the Owner`);

        } else if (type === "remove") {
            if (!data.includes(userId.id)) return message.channel.send(`${userId} is not Ownered`);
            data = data.filter(u => u !== userId.id);
            client.db.set("owner", data);
            message.channel.send(`${userId} has been removed from the Owner`);

        } else if (type === "clear") {
            data = [];
            client.db.set("owner", data);
            return message.channel.send("Owner has been cleared");

        } else {
            const Owner = data;

            let embed = {
                title: "Owner",
                color: 0x2fbc,
                description: "",
                footer: {
                    text: "anti-raid.xyz | " + data.length
                }
            };

            if (Owner.length == 0) {
                embed.description = "No users in owners";

            } else if (Owner.length > 10) {
                embed.description = Owner.slice(0, 10).map(user => `- <@${user}> (ID: ${user})`).join("\n");

                embed.footer = {
                    text: "Page 1"
                }

                const row = new ActionRowBuilder().addComponents([
                    new ButtonBuilder().setCustomId('prev').setLabel("<").setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('count').setLabel(`1/${Math.ceil(Owner.length / 10)}`).setStyle(ButtonStyle.Primary).setDisabled(true),
                    new ButtonBuilder().setCustomId('next').setLabel(">").setStyle(ButtonStyle.Primary)])

                const msg = await message.channel.send({ embeds: [embed], components: [row] });

                msg.author.id = message.author.id;
                return manageOwner(Owner, msg, client);
            } else {
                embed.description = Owner.map(user => `- <@${user}> (ID: ${user})`).join("\n");
            }
            message.channel.send({ embeds: [embed] });
        }
    }
}


async function manageOwner(data, message, client) {
    //each embed we gonna show 10 users

    let embeds = [];
    let users = [];
    let currentIndex = 0;
    for (let i = 0; i < data.length; i++) {
        users.push(data[i]);
        if (users.length === 10) {
            embeds.push({
                title: "Owner",
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
            title: "Owner",
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
            i.message.components = i.message.components.map(r=> {
                r.components.map(ch=> {
                if(ch.data.custom_id === "count") {
                    ch.data.label = currentIndex + 1 + "/" + embeds.length;
                }
                return ch;
            })
            return r;
        })
            i.update({embeds: [embeds[currentIndex]],components: i.message.components});
        } else if (i.customId === "prev") {
            currentIndex--;
            if (currentIndex < 0) currentIndex = embeds.length - 1;
            i.message.components = i.message.components.map(r=> {
                r.components.map(ch=> {
                if(ch.data.custom_id === "count") {
                    ch.data.label = currentIndex + 1 + "/" + embeds.length;
                }
                return ch;
            })
            return r;
        })
            i.update({embeds: [embeds[currentIndex]],components: i.message.components});
        }
    })

}