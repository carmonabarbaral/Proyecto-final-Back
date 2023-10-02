
const userModels = require('../../dao/models/userModels');

class UserRepository {
  async findById(userId) {
    return await userModels.findById(userId);
  }

  async findByEmail(email) {
    return await userModels.findOne({ email });
  }

  // puedo agregar otras operaciones según las necesidades de mi aplicación
}

module.exports = new UserRepository();
