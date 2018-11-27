const { utils } = require("../../index");
const { MongooseUtils } = require("../../plugins/mongoose");

module.exports = {
  ...utils,
  ...MongooseUtils
};
