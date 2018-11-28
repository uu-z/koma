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
  models,
  done
} = MongooseUtils;

module.exports = {
  name: "User",
  routes: () => ({
    "get /users": done(pagination("User")),
    "get /users/many": done(findMany("User")),
    "get /users/one": done(findOne("User")),
    "get /users/count": done(count("User")),
    "get /users/:id": done(findById("User")),
    "post /users/many": done(createMany("User")),
    "put /users/many": done(updateMany("User")),
    "put /users/one": done(updateOne("User")),
    "put /users/:id": done(updateById("User")),
    "delete /users/many": done(deleteMany("User")),
    "delete /users/one": done(deleteOne("User")),
    "delete /users/:id": done(deleteById("User"))
  }),
  controllers: {},
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
