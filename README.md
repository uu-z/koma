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
const { koma } = require("koma");

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
const { MongooseUtils } = require("koma/plugins/mongoose");

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
    "get /users/:id": findById("User"),
    "get /users/many": findMany("User"),
    "get /users/one": findOne("User"),
    "get /users/count": count("User"),
    "get /me": [checkToken, me],
    "post /login": [checkLogin, login],
    "post /signup": createOne("User"),
    "post /users/many": createMany("User"),
    "put /users/:id": updateById("User"),
    "put /users/many": updateMany("User"),
    "put /users/one": updateOne("User"),
    "delete /users/:id": deleteById("User"),
    "delete /users/many": deleteMany("User"),
    "delete /users/one": deleteOne("User")
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
```
