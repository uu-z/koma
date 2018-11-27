const _ = require("lodash");
const { MongooseUtils } = require("../../../plugins/mongoose");

const { findById, pagination, createOne, updateById, removeById, models } = MongooseUtils;

module.exports = {
  name: "User",
  routes: ({ checkToken, checkLogin, login, me }) => ({
    "get /users/:_id": findById("User"),
    "get /users": pagination("User"),
    "get /me": [checkToken, me],
    "post /signup": createOne("User"),
    "post /login": [checkLogin, login],
    "put /users/:_id": updateById("User"),
    "delete /users/:_id": removeById("User")
  }),
  controllers: {
    async login(ctx) {
      const { identifier, password } = ctx.request.body;

      const User = models("User");
      const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] }).select("+password");
      if (!user) return ctx.notFound;

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
    }
  },
  models: {
    User: {
      schema: {
        username: {
          type: "string",
          default: null
        },
        email: {
          type: "string",
          required: true,
          unique: true
        },
        password: {
          type: "string",
          select: false,
          required: true,
          bcrypt: true,
          hidden: true
        }
      }
    }
  },
  joi: {
    checkToken: {
      headers: {
        authorization: "string:,required"
      }
    },
    checkLogin: {
      body: {
        identifier: "string:,required",
        password: "string:,required"
      }
    }
  }
};
