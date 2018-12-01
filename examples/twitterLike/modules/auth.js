const _ = require("lodash");
const { MongooseUtils } = require("../../../plugins/mongoose");
const { createOne, models, done } = MongooseUtils;

module.exports = {
  name: "Auth",
  routes: () => ({
    "get /me": ["checkToken", "me"],
    "post /login": ["checkLogin", "login"],
    "post /signup": done(createOne("User"))
  }),
  controllers: {
    async login(ctx) {
      const { identifier, password } = ctx.request.body;

      const user = await models("User")
        .findOne({ $or: [{ email: identifier }, { username: identifier }] })
        .select("+password");
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
      ctx.body = await models("User").findOne({ _id: userId });
    }
  },
  models: {},
  joi: {
    checkLogin: {
      body: {
        identifier: "string:,required",
        password: "string:,required"
      }
    }
  }
};
