const Mhr = require("menhera").default;
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const monngose = require("mongoose");
const requireDir = require("require-dir");
const path = require("path");

module.exports = {
  name: "utils",
  utils: {
    // Token
    signJWT({ data }) {
      const { JWT_EXP, JWT_SECRET } = Mhr.config;
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
    },
    injectObjectArray(name) {
      return {
        $({ _key, _val }) {
          const key = `${name}.${_key}`;
          const target = _.get(Mhr, key, []);
          _.set(Mhr, key, [...target, ..._val]);
        }
      };
    },
    injectObjectDeep(name) {
      return {
        $({ _key, _val }) {
          const key = `${name}.${_key}`;
          const target = _.get(Mhr, key, {});
          _.set(Mhr, key, { ...target, ..._val });
        }
      };
    },
    injectArray(name) {
      return {
        _({ _val }) {
          let target = _.get(Mhr, name, []);
          _.set(Mhr, name, [...target, ..._val]);
        }
      };
    },
    relay(key) {
      return ({ _key, _val }) =>
        Mhr.$use({
          [key]: {
            [_key]: _val
          }
        });
    },
    load(dir) {
      return {
        _mount: _.values(
          requireDir(path.join(process.cwd(), dir), {
            filter(file) {
              const basename = path.basename(file, ".js");
              const load = _.get(Mhr, `metas.${basename}.load`, true);
              return load;
            },
            mapValue(v, b) {
              return v.name ? v : {};
            }
          })
        )
      };
    }
  }
};
