module.exports = {
  name: "Test",
  mixouts: {
    global: true,
  },
  routes: {
    "get /hello": "Test.controllers.hello"
  },
  controllers: {
    async hello(ctx, next) {
      await this.services.hello(ctx);
    }
  },
  services: {
    async hello(ctx) {
      ctx.body = "Hello World!";
    }
  }
};
