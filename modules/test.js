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
