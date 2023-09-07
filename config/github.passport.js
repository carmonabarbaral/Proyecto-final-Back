const passport = require('passport')
const GitHubStrategy = require('passport-github2')
const userModels = require('../dao/models/userModels')

const initializePassport = () => {
    passport.use('github', new GitHubStrategy({
        clientID:'Iv1.1b3f45da60ecb07a',
        clientSecret:'28700ac60ec6b3fea59baf979996b4b56e7a8cb4',
        callbackURL:'http://localhost:3000/api/session/github-callback',
    }, async(accsessToken, refreshToken, profile, done) => {
        try {
            const user = await userModels.findOne({username: profile._json.login})

            if(user){
                console.log('El usuario ya existe')
                return done(null, user)
            }

            const newUser = await userModels.create({
                username: profile._json.login,
                name: profile._json.name,
                email: profile._json.email,
                password: profile._json.password
            })

            return done(null, newUser)
        } catch(e) {
            return done(e)
        }
    }))

    passport.serializeUser((user, done) => {
        console.log({user})
        console.log('serializeUser')
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) => {
        console.log('deserealizeUser')
        const user = await userModels.findOne({_id: id})
        done(null, user)
    })
}

module.exports = initializePassport

