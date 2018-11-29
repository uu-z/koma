const Mhr = require("menhera").default;
const _ = require("lodash");
const kue = require("kue");

const { KUE_PORT = 8002, KUE_OPTION } = _.get(Mhr, "config", {});
const queue = kue.createQueue(KUE_OPTION);

module.exports = {
  name: "Kue",
  queue,
  $start: {
    app() {
      console.success("kue start~~~");
      kue.app.listen(KUE_PORT);
    }
  }
};
