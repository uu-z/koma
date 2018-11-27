const Mhr = require("menhera").default;
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

const MongooseUtils = {
  convertParams(name, values) {
    const model = mongoose.models[name];
    return _.pick(values, _.keys(model.schema));
  },
  models(name) {
    return mongoose.models[name];
  },
  createOne: name => async (ctx, next) => {
    const model = mongoose.models[name];
    ctx.body = await model.create(ctx.request.body);
  },
  pagination: name => async (ctx, next) => {
    const params = ctx.query;
    for (let [k, v] of Object.entries(params)) {
      params[k] = JSON.parse(v);
    }
    const model = mongoose.models[name];
    ctx.body = await model.paginate(params.query || {}, params.paginate || {});
  },
  findById: name => async ctx => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) return ctx.notFound();
    const model = mongoose.models[name];
    ctx.body = await model.findOne(ctx.params);
  },
  updateById: name => async ctx => {
    const data = utils.convertParams(name, ctx.request.body);
    const model = mongoose.models[name];
    await model.updateOne(ctx.query, data);
    ctx.body = await model.findOne(ctx.query);
  },
  removeById: name => async ctx => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) return ctx.notFound();
    const model = mongoose.models[name];
    ctx.bodt = await model.deleteOne(ctx.params);
  }
};

exports.mongoose = mongoose;
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
  $start: {
    async app() {
      const { MONGO_URL, MONGO_DATABASE } = _.get(Mhr, "config", {});
      await mongoose.connect(
        `mongodb://${MONGO_URL}/${MONGO_DATABASE}`,
        {
          useCreateIndex: true,
          useNewUrlParser: true
        }
      );
      console.success("mongodb start~~~");
    }
  },
  MongooseUtils
};
