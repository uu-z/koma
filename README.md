# kom-advaned

an advanced framework with koa & menhera

## Desc

combind `model` `route` `controller` `services` ... in just one module

```js
const Test = {
  name: "Test",
  routes: {
    "get /hello": "Test.controllers.hello"
  },
  controllers: {
    async hello(ctx) {
      ctx.body = await Test.services.hello();
    }
  },
  services: {
    async hello() {
      return "Hello World";
    }
  }
};

module.exports = Test;
```

## Start

1. `npm install`
2. `docker-compose up -d`

## Dev

1. `npm install`
2. `yarn dev`
