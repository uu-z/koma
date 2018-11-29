module.exports = {
  name: "Test",
  routes: {
    "get /hello": "hello"
  },
  controllers: {
    async hello(ctx) {
      ctx.body = "Hello World";
    }
  }
};
