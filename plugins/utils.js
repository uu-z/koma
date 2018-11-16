const _ = require("lodash");
const jwt = require("jsonwebtoken");
const monngose = require("mongoose");

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
      const model = monngose.models[name];
      return _.pick(values, _.keys(model.schema));
    },
    model(name) {
      return monngose.models[name];
    },
    create(name, params) {
      const model = monngose.models[name];
      return model.create(params);
    },
    findOne(name, params) {
      const model = monngose.models[name];
      return model.findOne(params);
    },
    updateOne(name, query, values) {
      const data = utils.convertParams(name, values);
      const model = monngose.models[name];
      return model.updateOne(query, data);
    },
    paginate(name, query, paginate) {
      const model = monngose.models[name];
      return model.paginate(query, paginate);
    },
    // Utils
    injectObject(name) {
      return {
        _({ _val }) {
          let target = _.get(Mhr, name, {});
          _.set(Mhr, name, { ...target, ..._val });
        }
      };
    }
  }
};

module.exports = utils;
