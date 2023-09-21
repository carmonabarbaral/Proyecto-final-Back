const passport = require('passport')
const registerStrategy = require('../strategies/registerStrategy')
const loginStrategy = require('../strategies/localStrategy')
const githubStrategy = require('../strategies/githubStrategies')
const userModels = require('../dao/models/userModels')


passport.use('register', registerStrategy)
passport.use('login', loginStrategy)
passport.use('github', githubStrategy)

passport.serializeUser((user, done) => {
    console.log('Serialize called')
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    console.log('Deserialize called')
    try {
      const user = await userModels.findById(id._id)
      done(null, user)
    } catch (e) {
      done(e, null)
    }
  })

module.exports = passport