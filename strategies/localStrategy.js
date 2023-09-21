const LocalStrategy = require('passport-local').Strategy
const userModels = require('../dao/models/userModels')
const {isValidPassword} = require('../utils/passwordHash')

    module.exports = new LocalStrategy(
        {usernameField: 'email'},
        async (email, password, done) => {
            try {
                let user = await userModels.findOne({email: email})
                if (!user) {
                    console.log('Usuario existente')
                    return done(null, false)
                }
                if(!isValidPassword(password, user.password)) {
                    console.log('Los datos son incorrectos')
                    return done(null, false)
                }
                user = user.toObject();
                delete user.password;
                done(null, user)
            } catch (e) {
                return done(e)
            }
        }
    );
                