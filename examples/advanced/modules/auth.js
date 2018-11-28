const _ = require("lodash");
const { MongooseUtils } = require("../../../plugins/mongoose");

const { createOne, models, done } = MongooseUtils;

module.exports = {
  name: "Auth",
  routes: ({ checkToken, checkLogin, login, me }) => ({
    "get /me": [checkToken, me],
    "post /login": [checkLogin, login],
    "post /signup": done(createOne("User"))
  }),
  controllers: {
    async login(ctx) {
      const { identifier, password } = ctx.request.body;

      const User = models("User");
      const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] }).select("+password");
      if (!user) return ctx.thorw(404, "user not exists");

      const validPassword = await user.verifyPassword(password);
      if (validPassword) {
        delete user.password;
        ctx.body = { user, token: ctx.signJWT({ data: user._id }) };
      } else {
        ctx.throw(401, "invalid username or password");
      }
    },
    async me(ctx) {
      const userId = _.get(ctx.state, "user.data");
      const User = models("User");
      ctx.body = await User.findOne({ _id: userId });
    },
    async checkToken(ctx, next) {
      const userId = _.get(ctx.state, "user.data");
      if (!userId) {
        ctx.throw(401, "Authentication Error");
      }
      await next();
    }
  },
  joi: {
    checkLogin: {
      body: {
        identifier: "string:,required",
        password: "string:,required"
      }
    }
  }
};
