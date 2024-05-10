const AntiRaidClient = require('./structure/client');
const {token, owners} = require('./config.json')
const client = new AntiRaidClient({
    token: token,
    owners: owners
});

client.connect();

module.exports = client;