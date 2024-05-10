class WhiteList {
   constructor(data) {
      this.guildID = data.guildId;
      this.wlUsers = data.wlUsers || [];
   }

   async getWhitelist() {
      return this.wlUsers;
   }

   async isWhitelist(userId) {
      return this.wlUsers.includes(userId);
   }

   async createData(client) {
      await client.db.set("whitelist_" + this.guildID, []);
      return this.getWhitelist();
   }

   async addWhitelist(userId, client) {
      this.wlUsers.push(userId);
      await client.db.set("whitelist_" + this.guildID, this.wlUsers);
      return this.isWhitelist(userId);
   }

   async removeWhitelist(userId, client) {
      this.wlUsers = this.wlUsers.filter(user => user !== userId);
      await client.db.set("whitelist_" + this.guildID, this.wlUsers);
      return this.isWhitelist(userId);
   }

   async clearWhitelist(client) {
      await client.db.set("whitelist_" + this.guildID, []);
      return this.getWhitelist();
   }

}

module.exports = WhiteList;