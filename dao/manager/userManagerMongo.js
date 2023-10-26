const userModels = require('../models/userModels');

class UserManagerMongo {
    async createUser(name, email,role, password) {
        try {
            const newUser = new userModels({
                name,
                email,
                role,
                password,
            });
            await newUser.save();
            return newUser;
        } catch (error) {
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            return await userModels.findOne({ email });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserManagerMongo;