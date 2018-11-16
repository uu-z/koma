const axios = require("axios");

module.exports = {
  name: "Axios",
  routes: {
    "get /axios": "proxyGet",
    "post /axios": "proxyPost"
  },
  controllers: {
    async proxyGet(ctx, next) {
      const { url } = ctx.request.query;
      let { data } = await axios.get(url);
      ctx.body = data;
    },
    async proxyPost(ctx, next) {
      let { data } = await axios(ctx.request.body);
      ctx.body = data;
    }
  }
};
