


const Discord = require('discord.js')
const sleep = (ms) =>  new Promise((resolve)=> setTimeout(resolve, ms));

module.exports = {
    name: 'messageCreate',
    run: async (client,message) => {
       
        const isGuild = "guild" in message;
        const isEphemeral = message.flags.has(Discord.MessageFlagsBitField.Flags.Ephemeral);
        const db = await client.db.get('antispam_' + message.guild.id) || false;
        const punishment = await client.db.get('punish_' + message.guild.id) || null;
        const isWhitelist = await client.isWhitelist(message.author.id, message.guild.id);
        const isOwner = await client.isOwner(message.author.id);
        
        if(!isGuild || !db) return;
        if(isEphemeral || isWhitelist || isOwner) return;
        const member = message.member;

        fetch("https://anti-raid.xyz/antispam",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": client.token
            },
            body: JSON.stringify({
                botID: client.user.id,
                guildID: message.guild.id,
                userID: member.id,
                channelID: message.channel.id,
                punishment: punishment,
                message: {
                    id: message.id,
                    channelID: message.channel.id,
                }
        })
        }).then(async res => {
            const data = await res.json();
            if(data.data) {
                console.log(`[AntiSpam] ------------`)
                console.log(data.data)
                console.log("-------------");
            }
        })
        



    },
};