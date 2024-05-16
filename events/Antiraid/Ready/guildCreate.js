const Discord = require('discord.js')
const sleep = (ms) =>  new Promise((resolve)=> setTimeout(resolve, ms));

module.exports = {
    name: 'guildCreate',
    run: async (client) => {
        client.emit("ready", true);
    }
};