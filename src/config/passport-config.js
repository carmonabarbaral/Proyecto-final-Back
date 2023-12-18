const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passportJwt = require("passport-jwt"); 
const User = require("../models/users.model");
const env = require("./config");
const Cart = require("../models/cart.model");


passport.use(
  "login",
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        console.log(
          "Login intent for email:",
          email
        );

        const user = await User.findOne({ email });
        if (!user) {
          console.log("Email not found:", email);
          return done(null, false, { message: "Incorrect username." });
        }

        console.log("User found:", user);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          console.log("Incorrect password for user:", user);
          return done(null, false, { message: "Incorrect password." });
        }

        console.log("Valid password for the user:", user);

        const token = jwt.sign({ user }, process.env.JWT_SECRET, {
          expiresIn: "1h",
          
        });
        console.log("Token generated for the user:", user);

        return done(null, { user: user.toObject(), token });
      } catch (error) {
        console.error("Error during login:", error);
        return done(error);
      }
    }
  )
);

passport.use(
  "register",
  new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, username, password, done) => {
      try {
        const user = await User.findOne({ email: username });
        if (user) {
          console.log("Existing user");
          return done(null, false);
        }

        const body = req.body;
        body.password = await bcrypt.hash(password, 10);

        const createCart = async () => {
          try {
            const newCart = await Cart.create({ products: [] });
            return newCart;
          } catch (error) {
            throw error;
          }
        };

        const newUser = await User.create(body);
        const newCart = await createCart();
        newUser.cart = newCart._id;
        await newUser.save();
        const token = jwt.sign({ newUser }, process.env.JWT_SECRET, {
          expiresIn: "1h",
          
        });
        return done(null, { newUser, token });
      } catch (e) {
        return done(e);
      }
    }
  )
);

passport.use(
  "github",
  new GitHubStrategy(
    {
      clientID: `${env.GITHUB_CLIENT_ID}`,
      clientSecret: `${env.GITHUB_CLIENT_SECRET}`,
      callbackURL: `${env.GITHUB_CALLBACK_URL}`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({
          $or: [
            { email: profile._json.email },
            { email: profile.emails[0].value },
          ],
        });
        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = await User.create({
          username: profile._json.login,
          email: profile.emails[0].value,
        });

        const newCart = await Cart.create({ products: [] });
        newUser.cart = newCart._id;
        await newUser.save();

        const token = jwt.sign({ newUser }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        return done(null, { newUser, token });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = passport;

