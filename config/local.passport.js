const passport = require('passport')
const passportLocal = require('passport-local')
const userModel = require('../dao/models/userModels')
const {createHash, isValidPassword} = require('../utils/passwordHash')
const userModels = require('../dao/models/userModels')

const LocalStrategy = passportLocal.Strategy

const initializepassport = () => {
    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: 'email'},
        async (req, username, password, done) => {
            try {
                const user = await userModels.findOne({email: username})
                if (user) {
                    console.log('Ususario existente')
                    return done(null, false)
                }

                const body = req.body
                body.password = createHash(body.password)
                console.log({body})

                const newUser = await userModels.create(body)

                return done(null, newUser)
            } catch (e){
            return done(e)
        }}
    ))

    passport.use('login', new LocalStrategy(
        {usernameField: 'email'},
        async(email, password, done) => {
            try {
                let user = await userModels.findOne({email: email})

                if (!user) {
                    console.log('Usuario inexistente')
                    return done(null, false)
                }

                if(!isValidPassword(password, user.password)) {
                    console.log('Los datos son incorrectos')
                    return done(null, false)
                }

                user = user.toObject()

                delete user.password

                done(null, user)
            }
        catch(e){
            return done(e)
        }}
    ))

    passport.serializeUser((user, done) =>{
        console.log('serializeUser')
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        console.log('deserealizedUser')
        try {
            const user = await userModels.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
}

module.exports = initializepassport