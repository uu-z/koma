const Mhr = require("menhera").default;
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
    }
  },
  RouterUtils: {
    InjectObjectRoutes({ routes, app }) {
      Mhr.$use({ start: { routes } });
      _.each(routes, (val, key) => {
        val = Array.isArray(val) ? val : [val];
        let fns = val.map(v => {
          if (typeof v == "string") {
            return v.split("|").map(key => {
              const method = _.get(Mhr, `methods.${key}`);
              if (!method) {
                throw new Error(`routes: method ${key} not exists`);
              }
              return method;
            });
          } else if (typeof v == "function") {
            return v;
          }
        });

        const [method, path] = key.split(" ");
        router[method](path, compose(_.flatten(fns)));
        app.use(router.routes());
        app.use(router.allowedMethods());
      });
    }
  }
};
