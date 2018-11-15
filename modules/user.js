const { utils } = require("../plugins/utils");
const compose = require("koa-compose");
const passport = require("koa-passport");
const _ = require("lodash");
const Joi = require("joi");
const validate = require("koa-joi-validate");

const User = {
  name: "User",
  routes: {
    "get /users/:_id": "User.controllers.findOne",
    "get /users": "User.controllers.list",
    "get /me": "User.controllers.me",
    "post /signup": "User.controllers.signUp",
    "post /login": {
      validator: "User.validators.login",
      handler: "User.controllers.login"
    },
    "put /users/:_id": "User.controllers.update"
  },
  validators: {
    login: validate({
      body: {
        identifier: Joi.string().required(),
        password: Joi.string().required()
      }
    })
  },
  controllers: {
    async signUp(ctx, next) {
      ctx.body = await utils.create("User", ctx.request.body);
    },
    async list(ctx, next) {
      const params = ctx.query;
      for (let [k, v] of Object.entries(params)) {
        params[k] = JSON.parse(v);
      }
      ctx.body = await utils.paginate("User", params.query || {}, params.paginate || {});
    },
    async findOne(ctx) {
      if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) return ctx.notFound();
      ctx.body = await utils.findOne("User", ctx.query);
    },
    async update(ctx) {
      await utils.updateOne("User", ctx.query, ctx.request.body);
      ctx.body = await utils.findOne("User", ctx.query);
    },
    async login(ctx) {
      const { identifier, password } = ctx.request.body;
      const user = await utils
        .findOne("User", { $or: [{ email: identifier }, { username: identifier }] })
        .select("+password");
      if (!user) {
        return ctx.notFound;
      }
      const validPassword = await user.verifyPassword(password);
      if (validPassword) {
        delete user.password;
        ctx.body = { user, token: utils.signJWT({ data: user._id }) };
      } else {
        ctx.throw(401, "invalid username or password");
      }
    },
    async me(ctx) {
      const userId = _.get(ctx.state, "user.data");
      ctx.body = await utils.findOne("User", { _id: userId });
    }
  },
  services: {}
};
module.exports = User;
