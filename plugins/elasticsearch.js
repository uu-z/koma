const Mhr = require("menhera").default;
const es = require("koa-elasticsearch");
const _ = require("lodash");

const { ES_PORT, ES_HOST } = _.get(Mhr, "config");

module.exports = {
  name: "ElasticeSearch",
  $start: {
    plugins({ _val }) {
      console.success("Elasticsearch start~~~");
    }
  },
  use: [
    es({
      host: {
        host: ES_HOST,
        port: ES_PORT
      }
    })
  ]
};
