const _ = require("lodash");
const { MongooseUtils } = require("../../../plugins/mongoose");

const {
  findById,
  findMany,
  findOne,
  pagination,
  createOne,
  createMany,
  updateById,
  updateMany,
  updateOne,
  deleteById,
  deleteMany,
  deleteOne,
  count,
  models
} = MongooseUtils;

module.exports = {
  name: "User",
  routes: ({ checkToken, checkLogin, login, me }) => ({
    "get /users": pagination("User"),
    "get /users/many": findMany("User"),
    "get /users/one": findOne("User"),
    "get /users/count": count("User"),
    "get /users/:id": findById("User"),
    "get /me": [checkToken, me],
    "post /login": [checkLogin, login],
    "post /signup": createOne("User"),
    "post /users/many": createMany("User"),
    "put /users/many": updateMany("User"),
    "put /users/one": updateOne("User"),
    "put /users/:id": updateById("User"),
    "delete /users/many": deleteMany("User"),
    "delete /users/one": deleteOne("User"),
    "delete /users/:id": deleteById("User")
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
