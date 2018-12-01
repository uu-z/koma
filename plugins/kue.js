const Mhr = require("menhera").default;
const _ = require("lodash");
const kue = require("kue");

const {
  KUE_PORT = 8002,
  KUE: { options = {} }
} = _.get(Mhr, "config", {});
const queue = kue.createQueue(options);

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
