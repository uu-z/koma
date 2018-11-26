const { koma } = require("../index");

koma.$use({
  routes: {
    "get /": ctx => (ctx.body = "Hello World")
  },
  start: {
    config: {
      PORT: 8001
    }
  }
});
