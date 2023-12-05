const userModels = require('../dao/models/userModels')
const {createHash, isValidPassword} = require('../utils/passwordHash')

async function findUserByEmail (email) {
  try {
    const user = await userModels.findOne({ email: email })
    return user
  } catch (error) {
    console.error(error)
    throw new Error('Error while getting user')
  }
}

async function createUser (userData) {
    try {
        userData.password = createHash(userData.password)
      const newUser = await userModels.create(userData)
       return newUser
    }
       catch (error) {
       console.error(error)
       throw new Error('Error while creating user')
    }
}

async function updatePassword(email, newPassword) {
    try {
        const hashedPassword = createHash(newPassword)
        await userModels.updateOne({email: email}, {password: hashedPassword})
    } catch (error) {
        console.error(error)
        throw new Error('Error while updating password')
    }
}

module.exports = {
    findUserByEmail,
    createUser,
    updatePassword
}