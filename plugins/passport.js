const localStrategy = require("passport-local").Strategy;
const passport = require("koa-passport");
const { utils } = require("./utils");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = {
  name: "Passport",
  $passport: {
    $({ _key, _val }) {
      passport.use(_key, _val);
    }
  },
  passport: {
    signup: new localStrategy({ usernameField: "email", passwordField: "password" }, async (email, password, done) => {
      try {
        const user = await utils.create("User", { email, password });
        return done(null, user);
      } catch (error) {
        done(error);
      }
    }),
    login: new localStrategy({ usernameField: "email", passwordField: "password" }, async (email, password, done) => {
      try {
        const user = await utils.findOne("User", { email }).select("+password");
        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        const validate = await user.verifyPassword(password || "");
        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }
        delete user.password;
        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    })
  }
};
