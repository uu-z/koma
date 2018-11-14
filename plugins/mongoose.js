const mongoose = require("mongoose");
const _ = require("lodash")
const uniqueValidator = require("mongoose-unique-validator")
const paginate = require("mongoose-paginate")

paginate.options = {
  lean:  true,
  limit: 20
};

const globalPlugins = [uniqueValidator, paginate]
globalPlugins.forEach(plugin => {
  mongoose.plugin(plugin)
})

module.exports = {
  name: "Mongoose",
  $models: {
    $({ _key, _val, cp }) {
      const { schema = {}, plugins = [], set = {} } = _val;
      const Schema = new mongoose.Schema(schema);
      plugins.forEach(plugin => {
        Schema.plugin(plugin);
      });
      _.each(set, (val, key) => {
        Schema.set(key, val)
      })

      const model = mongoose.model(_key, Schema);
      _val.model = model
      Object.assign(cp.models[_key], {
        model
      })
      _.set(Mhr, `models.${_key}`, model)
    }
  },
  $config: {
    async _({ _val }) {
      const { MONGO_URL, MONGO_DATABASE, MONGO_ENABLE } = _val;
      if(!MONGO_ENABLE) return
      let db = await mongoose.connect(`mongodb://${MONGO_URL}/${MONGO_DATABASE}`, {
        useNewUrlParser: true
      });
      this.db = db;
    }
  }
};
