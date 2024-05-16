
const discord = require("discord.js");
const moduleName = "antichanneldelete";
const moduleSecondName = "antichannelcreate";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
    name: "guildAuditLogEntryCreate",
    run: async (client, entry, guild) => {
        await sleep(500);
        if (
            [
                discord.AuditLogEvent.ChannelCreate,
                discord.AuditLogEvent.ChannelUpdate,
                discord.AuditLogEvent.ChannelOverwriteCreate,
                discord.AuditLogEvent.ChannelOverwriteUpdate,
                discord.AuditLogEvent.ChannelOverwriteDelete,
                discord.AuditLogEvent.ChannelDelete,
            ].includes(entry.action)
        ) {

            const data = await client.db.get("antichanneldelete_" + guild.id);
            const data2 = await client.db.get("antichannelupdate_" + guild.id); 
            const isWhitelist = await client.isWhitelist(entry.executorId, guild.id);
            const isOwner = await client.isOwner(entry.executorId);
            if (entry.executorId == client.user.id) return;
            if (!data ||!data2 || isWhitelist || isOwner) {
                client.emit("ready", true);
                return;
            }
        }
    }
};