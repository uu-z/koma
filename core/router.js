const Mhr = require("menhera").default;
const { $set } = require("menhera");
const { utils } = require("./utils");
const _ = require("lodash");
const compose = require("koa-compose");

const Router = require("koa-router");
const router = new Router();

exports.router = router;
module.exports = {
  name: "Router",
  $routes: {
    ...utils.injectFunctionArray("routes_F"),
    ...utils.injectObject("routes")
  },
  $start: {
    app({ _val: app }) {
      Mhr.$use({ start: { router: true } });
      let objRoutes = _.get(Mhr, "routes", {});
      let fnRoutes = _.get(Mhr, "routes_F", []);
      let methods = _.get(Mhr, "methods", {});
      fnRoutes.forEach(fn => {
        objRoutes = { ...objRoutes, ...fn(methods) };
      });
      this.RouterUtils.InjectObjectRoutes({ routes: objRoutes, app });

      // $set(Mhr, {
      //   methods: undefined,
      //   routes: undefined,
      //   routes_F: undefined,
      //   use: undefined
      // });
    }
  },
  RouterUtils: {
    InjectObjectRoutes({ routes, app }) {
      Mhr.$use({ start: { routes } });
      _.each(routes, (val, key) => {
        let fn, fns;
        if (typeof val == "string") {
          fns = val.split("|").map(key => {
            const method = _.get(Mhr, `methods.${key}`);
            if (!method) {
              throw new Error(`routes: method ${key} not exists`);
            }
            return method;
          });
          fn = compose(fns);
        } else if (typeof val == "function") {
          fn = val;
        } else if (Array.isArray(val)) {
          fn = compose(val);
        }

        const [method, path] = key.split(" ");
        router[method](path, fn);
        app.use(router.routes());
        app.use(router.allowedMethods());
      });
    }
  }
};
