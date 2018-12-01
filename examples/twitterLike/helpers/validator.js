module.exports = {
  name: "validator",
  controllers: {
    async checkToken(ctx, next) {
      const userId = _.get(ctx.state, "user.data");
      if (!userId) {
        ctx.throw(401, "Authentication Error");
      }
      await next();
    }
  }
};
