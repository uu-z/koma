# koma

Combind `model` `route` `controller` `services` `validators`... everything you want in just one module

## install

```
> yarn add koma
```

### start

```js
const { koma } = require("koma");

koma.$use({
  routes: {
    "get /": async ctx => (ctx.body = "Hello World")
  },
  start: {
    config: {
      PORT: 8001,
      RUN: true
    }
  }
});
```

### Advanced Example

after start advanced example. you can open `http://localhost:8001/playground` to play with graphql playground

```js
const { koma } = require("../../index");

koma.$use({
  start: {
    metas: {
      mongoose: { load: true },
      graphql: { load: true },
      redis: { load: true }
    },
    load: {
      plugins: [],
      modules: ["./examples/advanced/modules"]
    },
    config: {
      PORT: 8001,
      RUN: true
    }
  }
});
```

```js
const _ = require("lodash");
const utils = require("../utils");

module.exports = {
  name: "User",
  routes: ({ checkToken, checkLogin, login, createOne, me, findById, pagination, updateById, removeById }) => ({
    "get /users/:_id": findById("User"),
    "get /users": pagination("User"),
    "get /me": [checkToken, me],
    "post /signup": createOne("User"),
    "post /login": [checkLogin, login],
    "put /users/:_id": updateById("User"),
    "delete /users/:_id": removeById("User")
  }),
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
  },
  controllers: {
    async login(ctx) {
      const { identifier, password } = ctx.request.body;
      const user = await utils
        .findByIdOne("User", { $or: [{ email: identifier }, { username: identifier }] })
        .select("+password");
      if (!user) {
        return ctx.notFound;
      }
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
      ctx.body = await utils.findOne("User", { _id: userId });
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
  }
};
```
