const Mhr = require("menhera").default;
const mongoose = require("mongoose");
const _ = require("lodash");
const uniqueValidator = require("mongoose-unique-validator");
const paginate = require("mongoose-paginate");
const hidden = require("mongoose-hidden");
const autopopulate = require("mongoose-autopopulate");
const bcrypt = require("mongoose-bcrypt");
const aqp = require("api-query-params");

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
  convertMultiParams(name, arr = []) {
    return arr.map(val => MongooseUtils.convertParams(name, val));
  },
  models(name) {
    return mongoose.models[name];
  },
  createOne: name => async ctx => {
    const model = mongoose.models[name];
    ctx.body = await model.create(ctx.request.body);
  },
  createMany: name => async ctx => {
    const model = mongoose.models[name];
    const { docs } = ctx.request.body;
    ctx.body = await model.insertMany(docs);
  },
  pagination: name => async ctx => {
    const { filter, skip, limit = 10, sort, select, page, lean = true } = aqp(ctx.query);
    const model = mongoose.models[name];
    ctx.body = await model.paginate(filter, {
      select,
      sort,
      populate: select,
      offset: skip,
      limit,
      page,
      lean
    });
  },
  findById: name => async ctx => {
    if (!ctx.params.id.match(/^[0-9a-fA-F]{24}$/)) return ctx.notFound();
    const model = mongoose.models[name];
    ctx.body = await model.findById(ctx.params.id);
  },
  findOne: name => async ctx => {
    const { filter } = aqp(ctx.query);
    const model = mongoose.models[name];
    ctx.body = await model.findOne(filter);
  },
  findMany: name => async ctx => {
    const { filter, select, limit = 10, skip, sort, lean = true } = aqp(ctx.query);
    const model = mongoose.models[name];
    ctx.body = await model
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(select)
      .lean(lean);
  },
  count: name => async ctx => {
    const { filter } = aqp(ctx.query);
    const model = mongoose.models[name];
    ctx.body = await model.count(filter);
  },
  updateById: name => async ctx => {
    const data = MongooseUtils.convertParams(name, ctx.request.body);
    const model = mongoose.models[name];
    const { id } = ctx.query;
    ctx.body = await model.findByIdAndUpdate(id, data);
  },
  updateOne: naem => async ctx => {
    const { filter } = aqp(ctx.query);
    const data = MongooseUtils.convertParams(name, ctx.request.body);
    const model = mongoose.models[name];

    ctx.body = await model.findOneAndUpdate(filter, data);
  },
  updateMany: naem => async ctx => {
    const { filter } = aqp(ctx.query);
    const model = mongoose.models[name];
    const { docs } = ctx.request.body;
    const datas = MongooseUtils.convertMultiParams(name, docs);
    ctx.body = await model.updateMany(filter, datas);
  },
  deleteById: name => async ctx => {
    if (!ctx.params.id.match(/^[0-9a-fA-F]{24}$/)) return ctx.notFound();
    const model = mongoose.models[name];
    ctx.bodt = await model.findByIdAndDelete(ctx.params.id);
  },
  deleteOne: name => async ctx => {
    const { filter } = aqp(ctx.query);
    const model = mongoose.models[name];
    ctx.body = await model.findOneAndDelete(filter);
  },
  deleteMany: name => async ctx => {
    const { filter } = aqp(ctx.query);
    const model = mongoose.models[name];
    ctx.body = await model.deleteMany(filter);
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
      Object.assign(cp.models[_key], { model });
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
