const discord = require("discord.js");
const moduleName = "antichanneldelete";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
module.exports = {
    name: "guildAuditLogEntryCreate",
    run: async (client, entry,guild) => {

        if (entry.action === discord.AuditLogEvent.ChannelDelete) {
            await sleep(1200);
            let data = await client.db.get("antichanneldelete_" + guild.id);
            if (!data) return;
            const isWhitelist = await client.isWhitelist(entry.executorId, guild.id);
            const isOwner = await client.isOwner(entry.executorId);
            const punishment = await client.db.get("punish_" + guild.id) || null;
            if (isOwner || isWhitelist) return;
            const rep = await fetch("https://anti-raid.xyz/channeldelete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": client.config.token
                },
                body: JSON.stringify({
                    guildID: guild.id,
                    botID: client.user.id,
                    userID: entry.executorId,
                    channelID: entry.targetId,
                    parent_id: null,
                    parent: entry.changes.find(o => o.key === "type").old === 4,
                    channels: guild.channels.cache.size === 0 ? [{
                        id: "",
                        name: "",
                        guild_id: guild.id
                    }] : guild.channels.cache.map(c => ({
                        id: c.id,
                        name: c.name,
                        guild_id: guild.id
                    })),
                    punishement: punishment
                })
            }).then(res => res.json())
            if (rep ?.data) {
                if (rep.data.message === "Channels recreated") {
                    console.log("[AntiChannel] Channels recreated");
                    console.log(rep.data);
                    console.log("-------------");
                }
            }
        }
        if (
            [
                discord.AuditLogEvent.ChannelUpdate,
                discord.AuditLogEvent.ChannelOverwriteCreate,
                discord.AuditLogEvent.ChannelOverwriteUpdate,
                discord.AuditLogEvent.ChannelOverwriteDelete
            ].includes(entry.action)
        ) {
            let data = await client.db.get("antichannelupdate_" + guild.id);
            if (!data) return console.log("No data");
            const isWhitelist = await client.isWhitelist(entry.executorId, guild.id);
            const isOwner = await client.isOwner(entry.executorId);
            const punishment = await client.db.get("punish_" + guild.id) || null;
            if (isOwner || isWhitelist) return console.log("Owner or Whitelisted");
            const rep = await fetch("https://anti-raid.xyz/channelupdate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": client.config.token
                },
                body: JSON.stringify({
                    botID: client.user.id,
                    guildID: guild.id,
                    channelID: entry.targetId,
                    userID: entry.executorId,
                    punshiment: punishment
                })

            }).then(res => res.json())
            if (rep ?.data) {
                if (rep.data.message === "Channels Updated") {
                    console.log("[AntiChannel] Channels Updated");
                    console.log(rep.data);
                    console.log("-------------");
                }
            }

        }
    }
}