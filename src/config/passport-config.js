const passport = require("passport");
const githubStrategy = require("../strategies/github.strategy");
const loginLocalStrategy = require("../strategies/login.local.strategy");
const registerLocalStrategy = require("../strategies/register.strategy");
const { jwtStrategy } = require("../strategies/jwt.strategy");

const initializePassport = () => {
  passport.use("register", registerLocalStrategy);
  passport.use("login", loginLocalStrategy);
  passport.use("github", githubStrategy);
  passport.use("jwt", jwtStrategy);
};

module.exports = initializePassport;

