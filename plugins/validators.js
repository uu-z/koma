const { utils } = require("./utils");
const validate = require("koa-joi-validate");
const _ = require("lodash");

module.exports = {
  name: "Validator",
  $validators: {
    $({ _key, _val }) {
      _.set(Mhr, `validators.${_key}`, validate(_val()));
    }
  }
};
