const { Client } = require("discord.js");
const config = require("../config.json")
const { QuickDB, JSONDriver } = require("quick.db");
const db = new QuickDB();
const fs = require("fs");
const path = require("path");

class AntiRaidClient extends Client {
    constructor(data, antiRaidOptions = {
        intents: [3276799],
        presence: {
            status: "dnd",
            activities: [{
                name: "anti-raid.xyz exemple bot",
                type: 4,
                url: "https://twitch.tv/jesaispasquoimettreici"

            }]
        }
    }) {
        super(antiRaidOptions)
        this.config = config;
        this.owners = data.owners;
        this.token = data.token;
        this.db = db;
        this.color = this.config.color
        this.commands = new Map();
    }

    async connect() {
        super.login(this.token)
        this._handler();
    }
    
    async _handler() {
        this._handleCommands();
        this._handleEvents(path.join(process.cwd() + "/events"));
    }

    async _handleEvents(dir) {
        fs.readdirSync(dir).forEach(file => {
            const filePath = path.join(dir, file);
            const folder = fs.statSync(filePath);
            if (folder.isDirectory()) {
                this._handleEvents(filePath);
            } else {
                const event = require(filePath);
                if (event.name && event.run && typeof event.run === 'function') {
                    this.on(event.name, (...args) => event.run(this, ...args));
                    console.log(`New Events`);
                };
            };
        });
    }   

    async _handleCommands() {
        const commandDirs = fs.readdirSync("./commands");
        for (const dir of commandDirs) {
            const commandFiles = fs.readdirSync(`./commands/${dir}`).filter(file => file.endsWith(".js"));
            for (const file of commandFiles) {
                const command = require(`../commands/${dir}/${file}`);
                command.folder = dir
                command.file = file
                this.commands.set(command.name, command);
            }
        }
    }

        
}

module.exports = AntiRaidClient;