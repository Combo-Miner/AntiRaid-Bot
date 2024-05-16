const discord = require('discord.js');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const moduleName = "antiroleupdate"

module.exports = {
    name: "guildAuditLogEntryCreate",
    /**
     * 
     * @param {Client} client 
     * @param {discord.Guild} guild 
     * @param {discord.GuildAuditLogsEntry} entry 
     * @returns 
     */
    run: async (client, entry, guild) => {
        await sleep(500);
        
        if (entry.action === discord.AuditLogEvent.RoleDelete) {
            const data = await client.db.get('antiroledelete_' + guild.id) || false;

            if (entry.userId === client.user.id) return;

            if (!data) {
                client.emit("ready", true);
                return;
            }

            const isOwner = await client.isOwner(entry.executorId);
            const isWhitelist = await client.isWhitelist(entry.executorId, guild.id);
            const punishment = await client.db.get('punish_' + guild.id) || null;

            let member = await guild.members.cache.get(entry.userId)

            if (isOwner || isWhitelist) {
                return client.emit("ready", true);
            }

            const rep = await fetch("https://anti-raid.xyz/roledelete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": client.config.token
                },
                body: JSON.stringify({
                    guildID: guild.id,
                    botID: client.user.id,
                    userID: entry.executorId,
                    roleID: entry.targetId,
                    punishement: punishment
                })
            }).then(res => res.json())
            if (rep?.data) {
                if (rep.data.message === "Roles recreated") {
                    console.log("[AntiRole] Roles recreated");
                    console.log(rep.data);
                    console.log("-------------");
                }
            }
        }

        if (entry.action !== discord.AuditLogEvent.RoleUpdate) return;

        const data = await client.db.get('antiroleupdate_' + guild.id) || false;
        const newRole = await guild.roles.cache.get(entry.targetId)
        if (!newRole) return;
        if (newRole.managed) return;
        if (entry.userID === client.user.id) return;
        if (!data) {
            client.emit("ready", true);
            return;
        }

        const isOwner = await client.isOwner(entry.executorId);
        const isWhitelist = await client.isWhitelist(entry.executorId, guild.id);
        const punishment = await client.db.get('punish_' + guild.id) || null;

        let member = await guild.members.cache.get(entry.userID)
        if (isOwner || isWhitelist) {
            return client.emit("ready", true);
        }

        const rep = await fetch("https://anti-raid.xyz/roleupdate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": client.config.token
            },
            body: JSON.stringify({
                guildID: guild.id,
                botID: client.user.id,
                userID: entry.executorId,
                roleID: entry.targetId,
                punishement: punishment
            })
        }).then(res => res.json())
        console.log(rep);
        if (rep?.data) {
            if (rep.data.message === "Roles Updated") {
                console.log("[AntiRole] Roles Updated");
                console.log(rep.data);
                console.log("-------------");
            }


        }
    }
}