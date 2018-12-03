const { koma } = require("../index");

koma.$use({
  routes: {
    "get /": async ctx => (ctx.body = "Hello World")
  },
  metas: {
    "get /": {
      role: ["admin", "auth", "all"],
      token: false
    }
  },
  start: {
    config: {
      PORT: 8001,
      RUN: true
    }
  }
});
