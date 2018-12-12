const { koma } = require("koma");

koma.$use({
  routes: {
    "post /axios": async (ctx, next) => {
      let { data } = await axios(ctx.request.body);
      ctx.body = data;
    }
  },
  start: {
    config: {
      PORT: 8001,
      RUN: true
    }
  }
});
