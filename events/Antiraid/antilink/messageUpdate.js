



const Discord = require('discord.js')
const sleep = (ms) =>  new Promise((resolve)=> setTimeout(resolve, ms));
const regexLink = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
const discordRegex = /(?:https?:\/\/)?discord(?:app.com\/invite|.gg)/;



module.exports = {
    name: 'messageUpdate',
    run: async (client,message,newMessage) => {
        console.log(newMessage.content)
       
        const isGuild = "guild" in message;
        const isEphemeral = message.flags.has(Discord.MessageFlagsBitField.Flags.Ephemeral);
        const db = await client.db.get('antilink_' + message.guild.id) || false;
        const punishment = await client.db.get('punish_' + message.guild.id) || null;
        const isWhitelist = await client.isWhitelist(message.author.id, message.guild.id);
        const isOwner = await client.isOwner(message.author.id);
        
        if(!isGuild || !db) return;
        if(isEphemeral || isWhitelist || isOwner) return;

        const member = message.member;

        const isLink = regexLink.test(newMessage.content) || discordRegex.test(newMessage.content);
        if(!isLink) return;

        fetch("https://anti-raid.xyz/antilink",{
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
                messageID: message.id,
                punishment: punishment,
                messageContent: newMessage.content,
        })
        }).then(async res => {
            const data = await res.json();
            if(data.data) {
                console.log(`[AntiLink] ------------`)
                console.log(data.data)
                console.log("-------------");
            }
        })
        

    },
};