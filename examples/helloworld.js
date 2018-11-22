const { koma } = require("../index");

koma.$use({
  routes: {
    "get /": "hello"
  },
  controllers: {
    async hello(ctx) {
      ctx.body = "Hello World!";
    }
  },
  start: {
    config: {
      PORT: 8001
    }
  }
});
