const Mhr = require("menhera").default;
const { Client } = require("elasticsearch");
const _ = require("lodash");

const {
  ES: {
    options = {
      host: "localhost:9200",
      log: "trace"
    }
  }
} = _.get(Mhr, "config");

const es = new Client({ ...options });

module.exports = {
  name: "ElasticeSearch",
  es,
  $start: {
    app() {
      console.success("Elasticsearch start~~~");
    }
  }
};
