const _ = require("lodash");
const Mhr = require("menhera").default;

module.exports = {
  name: "graphqlWrap",
  $hook: {
    graphqlSchmas: {
      $({ _val, _key }) {
        if (_val.hide) {
          _.set(Mhr, "graphqlSchmas.${_key}", undefined);
        }
      }
    }
  },
  graphql: {
    metas: {
      FeedFindById: { hide: true },
      FeedFindMany: { hide: true }
    }
  }
};
