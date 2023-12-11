const GitHubStrategy = require('passport-github2');
const userModels = require('../src/dao/models/userModels');
const Cart = require('../src/dao/models/cartModels');
const jwt = require('jsonwebtoken');
const config = require('../src/config/config');

module.exports = new GitHubStrategy(
  {
    clientID: `${config.github.clientID}`,
    clientSecret: `${config.github.clientSecret}`,
    callbackURL: `${config.github.callbackURL}`,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Github strategy called');
      const existingUser = await userModels.findOne({
        $or: [{ email: profile._json.email }, { email: profile.emails[0].value }],
      });

      if (existingUser) {
        console.log('Usuario existente');
        // En lugar de devolver el usuario directamente, generamos un JWT y lo devolvemos al cliente
        const token = jwt.sign({ userId: existingUser._id }, config.jwtSecret, {
          expiresIn: '1h', // Puedes configurar la duración del token según tus necesidades
        });
        return done(null, { token }); // Devolvemos el token al cliente
      }

      console.log('Github Email', profile.emails);

      const createCart = async () => {
        try {
          const newCart = await Cart.create({ products: [] });
          return newCart;
        } catch (error) {
          throw error;
        }
      };

      const newUser = await userModels.create({
        username: profile._json.login,
        name: profile._json.name,
        email: profile.emails[0].value,
      });

      const newCart = await createCart();
      newUser.cart = newCart._id;
      await newUser.save();
      console.log('New user created', newUser);

      // Generamos un JWT y lo devolvemos al cliente
      const token = jwt.sign({ userId: newUser._id }, config.jwtSecret, {
        expiresIn: '1h', 
      });

      return done(null, { token }); // Devolvemos el token al cliente
    } catch (e) {
      console.log('Error in github strategy', e);
      return done(e);
    }
  }
);
