# koma

An advanced framework based on easy maintenance

## Desc

combind `model` `route` `controller` `services` `validators`... everything you want in just one module

```js
const _ = require("lodash");
const { utils } = require("../plugins/utils");

module.exports = {
  name: "User",
  routes: {
    "get /users/:_id": "findUser",
    "get /users": "listUser",
    "get /me": "checkToken|me",
    "post /signup": "signUp",
    "post /login": "checkLogin|login",
    "put /users/:_id": "updateUser"
  },
  validators: {
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
  },
  controllers: {
    async signUp(ctx, next) {
      ctx.body = await utils.create("User", ctx.request.body);
    },
    async listUser(ctx, next) {
      const params = ctx.query;
      for (let [k, v] of Object.entries(params)) {
        params[k] = JSON.parse(v);
      }
      ctx.body = await utils.paginate("User", params.query || {}, params.paginate || {});
    },
    async findUser(ctx) {
      if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) return ctx.notFound();
      ctx.body = await utils.findOne("User", ctx.query);
    },
    async updateUser(ctx) {
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
  services: {},
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
  }
};
```

## how to block a module

Just add a `.` prefix to a filename

```
mongoose.js -> .mongoose.js
```

## Dev

1. `npm install`
2. `docker-compose up`
