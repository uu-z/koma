module.exports = {
  routes: {
    "get /hello": async (ctx, next) => {
      ctx.body = "Hello World!";
    }
  }
};
