const axios = require("axios");

module.exports = {
  name: "Index",
  mixouts: {
    Index: "Index"
  },
  routes: {
    "get /": "Index.controllers.index"
  },
  controllers: {
    async index(ctx, next) {
      ctx.body = ctx.request;
    }
  }
};
