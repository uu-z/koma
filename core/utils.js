const Mhr = require("menhera").default;
const _ = require("lodash");
const requireDir = require("require-dir");
const path = require("path");
const signale = require("signale");
global.Promise = require("bluebird");

const { error, debug, info, start, success, warn, log } = signale;

Object.assign(console, {
  error,
  debug,
  info,
  start,
  success,
  warn,
  log
});

module.exports = {
  name: "utils",
  utils: {
    // Utils
    injectMethods(name) {
      return {
        $({ _key, _val }) {
          const key = `${name}.${_key}`;
          _.set(Mhr, key, _val);
        }
      };
    },
    injectFunctionArray(name) {
      return {
        F({ _val }) {
          let target = _.get(Mhr, name, []);
          _.set(Mhr, name, [...target, _val]);
        }
      };
    },
    injectObject(name) {
      return {
        O({ _val }) {
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
        $O({ _key, _val }) {
          const key = `${name}.${_key}`;
          const target = _.get(Mhr, key, {});
          _.set(Mhr, key, { ...target, ..._val });
        }
      };
    },
    injectVariableDeep(name) {
      return {
        $V({ _key, _val }) {
          const key = `${name}.${_key}`;
          _.set(Mhr, key, _val);
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
      dir = Array.isArray(dir) ? dir : [dir];
      return dir.map(val => ({
        mount: _.values(
          requireDir(path.resolve(val), {
            noCache: true,
            filter(file) {
              const basename = path.basename(file, ".js");
              const load = _.get(Mhr, `metas.${basename}.load`, true);
              const depends = _.get(Mhr, `metas.${basename}.depends_on`, []);
              const depends_valid = depends.every(i => _.get(Mhr, `metas.${basename}.load`, false));
              return load && depends_valid;
            },
            mapValue(v, b) {
              if (v.ignore) {
                v = _.omit(v, v.ignore);
              }

              return v;
            }
          })
        )
      }));
    }
  }
};
