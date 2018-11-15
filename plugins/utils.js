const _ = require("lodash");
const jwt = require("jsonwebtoken");

const utils = {
  name: "utils",
  $utils: {
    $({ _key, _val }) {
      _.set(Mhr, `utils.${_key}`, _val);
    }
  },
  utils: {
    // Token
    signJWT({ data }) {
      const { JWT_EXP, JWT_SECRET } = Mhr.configs;
      return jwt.sign({ data, exp: JWT_EXP }, JWT_SECRET);
    },
    // Model
    convertParams(name, values) {
      const { schema } = Mhr.models[name];
      return _.pick(values, _.keys(schema));
    },
    create(name, params) {
      const { model } = Mhr.models[name];
      return model.create(params);
    },
    findOne(name, params) {
      const { model } = Mhr.models[name];
      return model.findOne(params);
    },
    updateOne(name, query, values) {
      const data = utils.convertParams(name, values);
      const { model } = Mhr.models[name];
      return model.updateOne(query, data);
    },
    paginate(name, query, paginate) {
      const { model } = Mhr.models[name];
      return model.paginate(query, paginate);
    }
  }
};

module.exports = utils;
