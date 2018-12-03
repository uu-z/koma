const Mhr = require("menhera").default;
const { utils } = require("./utils");

module.exports = {
  name: "Controller",
  $methods: utils.injectMethods("methods")
};
