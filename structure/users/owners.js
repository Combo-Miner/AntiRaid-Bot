

class WhiteList {
     constructor(data) {
          this.owUsers = [];
     }

     async getOwners() {
          return this.owUsers;
     }

     async isOwner(userId) {
          return this.owUsers.includes(userId);
     }

     async createData(client) {
          await client.db.set("owners", []);
          return this.getOwners();
     }

     async addOwner(userId, client) {
          this.owUsers.push(userId);
          await client.db.set("owners", this.owUsers);
          return this.isOwner(userId);
     }

     async removeOwner(userId, client) {
          this.owUsers = this.owUsers.filter(user => user !== userId);
          await client.db.set("owners", this.owUsers);
          return this.isOwner(userId);
     }

     async clearOwner(client) {
          await client.db.set("owners", []);
          return this.getOwners();
     }

}

module.exports = WhiteList;