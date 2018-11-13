module.exports = {
  name: "Test",
  routes: {
    "get /hello": "Test.controllers.hello"
  },
  controllers: {
    async hello(ctx, next) {
      await Mhr.Test.services.hello(ctx);
    }
  },
  services: {
    async hello(ctx) {
      ctx.body = "Hello World!";
    }
  }
};
