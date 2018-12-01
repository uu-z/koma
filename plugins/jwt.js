const Mhr = require("menhera").default;
const koaJwt = require("koa-jwt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const {
  JWT,
  JWT: { SECRET = "secred", EXP = Math.floor(Date.now() / 1000) + 60 * 60 * 12 }
} = _.get(Mhr, "config", {});

module.exports = {
  name: "JWT",
  use: [koaJwt(JWT)],
  signJWT: ({ data }) => jwt.sign({ data, exp: EXP }, SECRET)
};
