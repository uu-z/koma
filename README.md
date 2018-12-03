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

### Typescript

```js
import { MongooseUtils } from "koma/plugins/mongoose";
const { models } = MongooseUtils;
import bp from "koma/plugins/blueprint";

export default class Index {
  routes = {
    "get /": "testFindOne",
    "post /": "testCreateOne"
  };

  @bp.method()
  async testFindOne(ctx: any) {
    ctx.body = await models("Test").findOne(ctx.query);
  }

  @bp.method()
  async testCreateOne(ctx: any) {
    ctx.body = await models("Test").create(ctx.request.body);
  }

  models = {
    Test: {
      schema: {
        text: { type: "string" }
      }
    }
  };
}
```

### Advanced Example

after start advanced example. you can open `http://localhost:8001/playground` to play with graphql playground

```js
const { koma, config } = require("../../index");
const path = require("path");

koma.$use({
  start: {
    metas: {
      mongoose: { load: true },
      graphql: { load: true, depends_on: ["mongoose"] },
      redis: { load: true },
      elasticsearch: { load: true },
      kue: { load: true }
    },
    load: {
      plugins: [],
      modules: ["modules", "helpers"].map(i => path.join(__dirname, i))
    },
    config: {
      PORT: 8001,
      KUE_PORT: 8002,
      RUN: true
    }
  }
});
```

```js
const _ = require("lodash");
const { MongooseUtils, mongoose } = require("koma/plugins/mongoose");
const { findById, pagination, updateById, done, models } = MongooseUtils;

module.exports = {
  name: "User",
  routes: () => ({
    "get /users": done(pagination("User")),
    "get /users/:id": done(findById("User")),
    "put /users/:id": ["checkToken", done(updateById("User"))]
  }),
  methods: {},
  models: {
    User: {
      schema: {
        nickname: { type: "string" },
        username: { type: "string", required: true, unique: true },
        email: { type: "string", required: true, unique: true },
        password: { type: "string", select: false, required: true, bcrypt: true, hidden: true }
      },
      options: {
        timestamp: true
      }
    }
  }
};
```
