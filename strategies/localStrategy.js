const LocalStrategy = require('passport-local').Strategy;
const userModels = require('../error/models/userModels');


module.exports = new LocalStrategy(
  { passReqToCallback: true, usernameField: 'email' },
  async (req, email, password, done) => {
    try {
      const user = await userModels.findOne({ email });

      if (!user) {
        return done(null, false, { error: 'Usuario inexistente' });
      }

      const isValid = user.validatePassword(password);

      if (!isValid) {
        return done(null, false, { error: 'Clave incorrecta' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);