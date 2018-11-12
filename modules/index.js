const axios = require("axios");

module.exports = {
  routes: {
    "get /": async (ctx, next) => {
      const { url } = ctx.request.query;
      let { data } = await axios.get(url);
      ctx.body = data;
    }
  }
};
