const Mhr = require("menhera").default;
const mongoose = require("mongoose");
const _ = require("lodash");
const aqp = require("api-query-params");

const {
  MONGOOSE: {
    dburl = "mongodb://localhost:27017/test",
    plugins = {},
    options = {
      useCreateIndex: true,
      useNewUrlParser: true
    }
  }
} = _.get(Mhr, "config", {});

const globalPlugins = {
  "mongoose-unique-validator": {},
  "mongoose-paginate": {
    lean: true,
    limit: 20
  },
  "mongoose-hidden": {},
  "mongoose-autopopulate": {},
  "mongoose-bcrypt": {},
  ...plugins
};

_.each(globalPlugins, (options, name) => {
  const plugin = require(name);
  mongoose.plugin(plugin, options);
});

const MongooseUtils = {
  convertParams(name, values) {
    const model = mongoose.models[name];
    return _.pick(values, _.keys(model.schema.obj));
  },
  done: fn => async ctx => {
    ctx.body = await fn(ctx);
  },
  convertMultiParams(name, arr = []) {
    return arr.map(val => MongooseUtils.convertParams(name, val));
  },
  models(name) {
    if (_.isArray(name)) {
      return name.map(v => mongoose.models[v]);
    }
    return mongoose.models[name];
  },
  createOne: (name, options) => async ctx => {
    const model = mongoose.models[name];
    return await model.create(ctx.request.body);
  },
  createMany: name => async ctx => {
    const model = mongoose.models[name];
    return await model.insertMany(ctx.request.body);
  },
  pagination: (name, option = {}) => async ctx => {
    const { populate, page, lean = true } = ctx.query;
    const { filter, skip: offset, limit = 10, sort = "-createdAt", projection: select } = aqp(ctx.query, {
      blacklist: ["page", "populate", "lean"]
    });
    const options = _.omitBy(
      { select, sort, populate: option.populate || populate, offset, limit, page, lean },
      _.isUndefined
    );
    const model = mongoose.models[name];
    return await model.paginate(option.query || filter, options);
  },
  findById: name => async ctx => {
    if (!ctx.params.id.match(/^[0-9a-fA-F]{24}$/)) return ctx.throw(404, "Not Found");
    const model = mongoose.models[name];
    return await model.findById(ctx.params.id);
  },
  findOne: name => async ctx => {
    const { filter } = aqp(ctx.query);
    const model = mongoose.models[name];
    return await model.findOne(filter);
  },
  findMany: name => async ctx => {
    const { populate = "", lean = true } = ctx.query;
    const { filter, skip, limit = 10, sort = "-createdAt", projection: select } = aqp(ctx.query, {
      blacklist: ["populate", "lean"]
    });
    const model = mongoose.models[name];
    return await model
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate(populate)
      .select(select)
      .lean(lean);
  },
  count: name => async ctx => {
    const { filter } = aqp(ctx.query);
    const model = mongoose.models[name];
    return await model.count(filter);
  },
  updateById: name => async ctx => {
    if (!ctx.params.id.match(/^[0-9a-fA-F]{24}$/)) return ctx.throw(404, "Not Found");
    const data = MongooseUtils.convertParams(name, ctx.request.body);
    const model = mongoose.models[name];
    return await model.findByIdAndUpdate(ctx.params.id, data, { new: true });
  },
  updateOne: name => async ctx => {
    const { filter } = aqp(ctx.query);
    const data = MongooseUtils.convertParams(name, ctx.request.body);
    const model = mongoose.models[name];

    return await model.findOneAndUpdate(filter, data, { new: true }).exec();
  },
  updateMany: name => async ctx => {
    const { filter } = aqp(ctx.query);
    const model = mongoose.models[name];
    const { docs } = ctx.request.body;
    const datas = MongooseUtils.convertMultiParams(name, docs);
    return await model.updateMany(filter, datas);
  },
  deleteById: name => async ctx => {
    if (!ctx.params.id.match(/^[0-9a-fA-F]{24}$/)) return ctx.throw(404, "Not Found");
    const model = mongoose.models[name];
    ctx.bodt = await model.findByIdAndDelete(ctx.params.id);
  },
  deleteOne: name => async ctx => {
    const { filter } = aqp(ctx.query);
    const model = mongoose.models[name];
    return await model.findOneAndDelete(filter);
  },
  deleteMany: name => async ctx => {
    const { filter } = aqp(ctx.query);
    const model = mongoose.models[name];
    return await model.deleteMany(filter);
  }
};

module.exports = {
  name: "Mongoose",
  mongoose,
  aqp,
  $models: {
    $({ _key, _val, cp }) {
      const { schema = {}, plugins = {}, set = {}, methods = {}, virtuals, options = {}, done } = _val;
      const Schema = new mongoose.Schema(schema, options);
      _.each(virtuals, (val, key) => {
        Schema.virtual(key, val);
      });
      _.each(plugins, (option, key) => {
        const plugin = require(key);
        Schema.plugin(plugin, option);
      });
      _.each(set, (val, key) => {
        Schema.set(key, val);
      });
      _.each(methods, (val, key) => {
        Schema.methods.key = val;
      });

      const model = mongoose.model(_key, Schema);
      done && done(model);
    }
  },
  $start: {
    async app() {
      await mongoose.connect(
        dburl,
        options
      );
      console.success("mongodb start~~~");
    }
  },
  MongooseUtils
};
