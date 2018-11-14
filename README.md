# kom-advaned

an advanced framework with koa & menhera

## Desc
combind `model` `route` `controller` `services` ... in just one module
```js

module.exports = {
  name: "Test",
  routes: {
    "get /hello": "Test.controllers.hello"
  },
  controllers: {
    async hello(ctx, next) {
      ctx.body = await this.services.hello();
    }
  },
  services: {
    async hello() {
      return 'Hello World'
    }
  }
};


```


## Start
1. `npm install`
2. `docker-compose up -d` 


## Dev
1. `npm install`
2. `yarn dev` 


