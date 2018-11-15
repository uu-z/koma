const axios = require("axios");

exports.name = "123";

module.exports = {
  name: "Axios",
  routes: {
    "get /axios": "Axios.controllers.get",
    "post /axios": "Axios.controllers.post"
  },
  controllers: {
    async get(ctx, next) {
      const { url } = ctx.request.query;
      let { data } = await axios.get(url);
      ctx.body = data;
    },
    async post(ctx, next) {
      let { data } = await axios(ctx.request.body);
      ctx.body = data;
    }
  }
};
