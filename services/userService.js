const UserManagermongo = require('../dao/manager/userManagerMongo');
const UserManagerfile = require('../dao/manager/userManagerFile');
const USE_MONGO_DB = require('../config/config');
const userManager = USE_MONGO_DB ? new UserManagermongo() : new UserManagerfile();

async function forgotPassword(email) {
  try {
    await userManager.forgotPassword(email);
  } catch (error) {
    console.error(error);
    throw new Error('Error al iniciar el proceso de recuperación de contraseña');
  }
}

module.exports = {
  forgotPassword,
};