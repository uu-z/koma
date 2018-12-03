const Mhr = require("menhera").default;
const { utils } = require("./utils");

module.exports = {
  name: "validators",
  $validators: utils.injectMethods("methods")
};
