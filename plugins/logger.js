module.exports = {
  name: "Loagger",
  use: [
    async (ctx, next) => {
      const start = new Date();
      await next();
      const ms = new Date() - start;
      console.info(`-> ${ctx.method} ${ctx.url} - ${ms}ms`);
    }
  ]
};
