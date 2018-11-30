const Mhr = require("menhera").default;
const koaJwt = require("koa-jwt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const { JWT } = _.get(Mhr, "config", {});

module.exports = {
  name: "JWT",
  use: [
    koaJwt(JWT),
    async (ctx, next) => {
      ctx.signJWT = ({ data }) => {
        return jwt.sign({ data, exp: JWT_EXP }, JWT_SECRET);
      };
      await next();
    }
  ]
};
