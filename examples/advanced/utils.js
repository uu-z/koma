const { utils } = require("../../index");
const { MongooseUtils, mongoose } = require("../../plugins/mongoose");

module.exports = {
  ...utils,
  ...MongooseUtils
};
