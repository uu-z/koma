const axios = require("axios");

module.exports = {
  name: "Index",
  routes: {
    "get /": "Index.controllers.index"
  },
  controllers: {
    async index(ctx, next) {
      const { url } = ctx.request.query;
      let { data } = await axios.get(url);
      ctx.body = data;
    }
  }
};
