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
