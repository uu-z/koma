const Mhr = require("menhera").default;
const { utils } = require("../core/utils");
const validate = require("koa-joi-validate");
const _ = require("lodash");
const builder = require("joi-json").builder();

module.exports = {
  name: "Validator",
  $validators: {
    $({ _key, _val }) {
      const schema = builder.build(_val);
      _.set(Mhr, `methods.${_key}`, validate(schema));
    }
  }
};
