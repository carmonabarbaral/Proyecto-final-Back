const passport = require('passport')
const passportLocal = require('passport-local')
const GitHubStrategy = require('passport-github2')
const userModels = require('../dao/models/userModels')
const {createHash, isValidPassword} = require('../utils/passwordHash')


const LocalStrategy = passportLocal.Strategy

const initializepassport = () => {
    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: 'email'},
        async (req, username, password, done) => {
            try {
                const user = await userModels.findOne({email: username})
                if (user) {
                    console.log('Usuario existente')
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
    passport.use('github', new GitHubStrategy({
        clientID:'Iv1.1b3f45da60ecb07a',
        clientSecret:'28700ac60ec6b3fea59baf979996b4b56e7a8cb4',
        callbackURL:'http://localhost:3000/api/sessions/github-callback',
    }, async(accsessToken, refreshToken, profile, done) => {
        try {

            console.log('GitHub Strategy called');

            const existingUser = await userModels.findOne({
                $or: [
                    { username: profile._json.login },
                    {email: profile.emails && profile.emails[0] ? profile.emails[0].value : null},
                
                ]
            });

            if (existingUser) {
    console.log('El usuario ya existe, pero vamos a autenticarlo');
    return done(null, { _id: existingUser._id, user: existingUser })
}
            console.log('GitHub Email(s):', profile.emails); 
            const newUser = await userModels.create({
                username: profile._json.login,
                name: profile._json.name,
                email:  profile.emails[0]
            })
            console.log('Nuevo Usuario:', newUser);
            return done(null, { _id: newUser._id, user: newUser });
        } catch(e) {
            console.error('Error en la estrategia de GitHub:', e);
            return done(e)
        }
    }))

    passport.serializeUser((user, done) =>{
        console.log('serializeUser')
        done(null, user._id)
    })


    passport.deserializeUser(async (serializedData, done) => {
        console.log('deserializedUser');
        try {
            const user = await userModels.findById(serializedData._id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
}
module.exports = initializepassport