const _ = require("lodash");

module.exports = {
  checkFields: (key, code, errMessage) => async (ctx, next) => {
    const val = _.get(ctx, key);
    if (val) {
      await next();
    } else {
      ctx.throw(401, errMessage || "field is incorrect");
    }
  }
};
