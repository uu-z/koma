const mongoose = require("mongoose");
const _ = require("lodash");
const uniqueValidator = require("mongoose-unique-validator");
const paginate = require("mongoose-paginate");
const hidden = require("mongoose-hidden");
const autopopulate = require("mongoose-autopopulate");
const bcrypt = require("mongoose-bcrypt");

paginate.options = {
  lean: true,
  limit: 20
};

const globalPlugins = [bcrypt, hidden, autopopulate, uniqueValidator, paginate];
globalPlugins.forEach(plugin => {
  mongoose.plugin(plugin);
});

module.exports = {
  name: "Mongoose",
  $models: {
    $({ _key, _val, cp }) {
      const { schema = {}, plugins = [], set = {}, methods = {} } = _val;
      const Schema = new mongoose.Schema(schema);
      plugins.forEach(plugin => {
        Schema.plugin(plugin);
      });
      _.each(set, (val, key) => {
        Schema.set(key, val);
      });
      _.each(methods, (val, key) => {
        Schema.methods.key = val;
      });

      const model = mongoose.model(_key, Schema);
      _val.model = model;
      Object.assign(cp.models[_key], {
        model
      });
      _.set(Mhr, `models.${_key}`, _val);
    }
  },
  async $config({ _val }) {
    const { MONGO_URL, MONGO_DATABASE, MONGO_ENABLE } = _val;
    if (!MONGO_ENABLE) return;

    let db = await mongoose.connect(
      `mongodb://${MONGO_URL}/${MONGO_DATABASE}`,
      {
        useCreateIndex: true,
        useNewUrlParser: true
      }
    );
    console.success("mongodb start~~~");
    this.db = db;
  }
};
