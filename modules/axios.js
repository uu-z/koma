const axios = require("axios");

module.exports = {
  name: "Axios",
  routes: {
    "post /axios": "Axios.controllers.axios"
  },
  controllers: {
    async axios(ctx, next) {
      let { data } = await axios(ctx.request.body);
      ctx.body = data;
    }
  }
};
