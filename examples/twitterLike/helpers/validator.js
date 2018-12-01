module.exports = {
  validators: {
    async checkToken(ctx, next) {
      const userId = _.get(ctx.state, "user.data");
      if (!userId) {
        ctx.throw(401, "Authentication Error");
      }
      await next();
    },
    async checkRole(ctx, next) {
      // TODO:
      await next();
    }
  }
};
