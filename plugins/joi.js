const Mhr = require("menhera").default;
const { utils } = require("../core/utils");
const validate = require("koa-joi-validate");
const _ = require("lodash");
const builder = require("joi-json").builder();

module.exports = {
  name: "Joi",
  $joi: {
    $({ _key, _val }) {
      const schema = builder.build(_val);
      utils.injectMethods("methods").$({
        _key,
        _val: validate(schema)
      });
    }
  }
};
