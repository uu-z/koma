const Cron = require("cron");
const { utils } = require("../packages/core/utils");
const Mhr = require("menhera").default;
const _ = require("lodash");

module.exports = {
  name: "Cron",
  Cron,
  $cron: utils.injectObject("cron"),
  $start: {
    app() {
      const cron = _.get(Mhr, "cron", {});
      _.each(cron, val => {
        new Cron.CronJob(val);
      });
      console.success("schedule start~~~");
    }
  }
  // cron: {
  //   name: {
  //     cronTime: "* * * * * *",
  //     onTick() {},
  //     start: true,
  //     timeZone: "Asia/Shanghai"
  //   }
  // }
};
