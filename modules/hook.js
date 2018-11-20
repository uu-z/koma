const { $get } = require("menhera");
const config = require("../config");

module.exports = {
  name: "Hook",
  load: !config.IS_PROD,
  routes: {
    "post /hook/get": "GetHook"
  },
  controllers: {
    async GetHook(ctx) {
      ctx.body = $get(Mhr, ctx.request.body);
    }
  }
};
