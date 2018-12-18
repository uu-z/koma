const _ = require("lodash");
const Mhr = require("menhera").default;

module.exports = {
  name: "graphqlWrap",
  $graphqlSchmas: {
    $({ _val, _key }) {
      if (_val.hide) {
        _.set(Mhr, "graphqlSchmas.${_key}", undefined);
      }
    }
  },
  gql: {
    Query: {
      FeedFindById: { hide: true }
    }
  }
};
