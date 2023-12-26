const { getUsersDAO } = require("../factories/user.dao.factory");
const UsersDTO = require("../dao/dto/users.dto");

class UsersRepository {
  constructor() {
    this.dao = getUsersDAO(process.env.STORAGE);
  }

  async getUsers(params) {
    const users = await this.dao.getUsers(params);

    if (users.length === 0) throw new Error("No users in database");

    const usersDTO = new UsersDTO(users);

    return usersDTO.users;
  }

  async getUserById(uid) {
    return this.dao.getUserById(uid);
  }

  async getUserByFilter(filter) {
    return this.dao.getUserByFilter(filter);
  }

  async addToMyCart(uid, pid) {
    return this.dao.addToMyCart(uid, pid);
  }

  async createUser(data) {
    return this.dao.createUser(data);
  }

  async resetPassword(uid, password) {
    return this.dao.resetPassword(uid, password);
  }

  async updateUserRole(uid, newRole) {
    return this.dao.updateUserRole(uid, newRole);
  }

  async updateUserLastConnection(user) {
    return this.dao.updateUserLastConnection(user);
  }

  async updateUserDocuments(uid, documentsToUpload) {
    return this.dao.updateUserDocuments(uid, documentsToUpload);
  }

  async deleteUser(uid) {
    return this.dao.deleteUser(uid);
  }

  async deleteInactiveUsers(usersToDelete) {
    return this.dao.deleteInactiveUsers(usersToDelete);
  }
}

module.exports = UsersRepository;