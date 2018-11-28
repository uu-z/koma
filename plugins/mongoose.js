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
  done: fn => async ctx => {
    ctx.body = await fn(ctx);
  },
  convertMultiParams(name, arr = []) {
    return arr.map(val => MongooseUtils.convertParams(name, val));
  },
  models(name) {
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
  pagination: name => async ctx => {
    const { populate, page, lean = true } = ctx.query;
    const { filter, skip: offset, limit = 10, sort = "-createdAt", projection: select } = aqp(ctx.query, {
      blacklist: ["page", "populate"]
    });
    const options = _.omitBy({ select, sort, populate, offset, limit, page, lean }, _.isUndefined);
    const model = mongoose.models[name];
    return await model.paginate(filter, options);
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
    const { populate } = ctx.query;
    const { filter, skip, limit = 10, sort = "-createdAt", projection: select } = aqp(ctx.query, {
      blacklist: ["page", "populate"]
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
    return await model.findByIdAndUpdate(ctx.params.id, data);
  },
  updateOne: name => async ctx => {
    const { filter } = aqp(ctx.query);
    const data = MongooseUtils.convertParams(name, ctx.request.body);
    const model = mongoose.models[name];

    return await model.findOneAndUpdate(filter, data).exec();
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
  ignore: ["mongoose"],
  mongoose,
  $models: {
    $({ _key, _val, cp }) {
      const { schema = {}, plugins = [], set = {}, methods = {} } = _val;
      _.each(schema, (val, key) => {
        if (val.type == "ObjectId") {
          _.set(schema[key], "type", mongoose.SchemaTypes.ObjectId);
        }
      });
      const Schema = new mongoose.Schema(schema, { timestamps: true });
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
