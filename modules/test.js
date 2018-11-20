module.exports = {
  name: "Test",
  routes: {
    "get /hello": "hello"
  },
  controllers: {
    async hello(ctx) {
      ctx.body = await this.services.hello();
    }
  },
  services: {
    async hello() {
      return "Hello World";
    }
  }
};
