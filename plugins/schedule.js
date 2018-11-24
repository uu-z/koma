const schedule = require("node-schedule");
const { utils } = require("../core/utils");
const Mhr = require("menhera").default;
const _ = require("lodash");

module.exports = {
  name: "Schedule",
  $schedules: utils.injectObject("schedules"),
  $start: {
    config() {
      const schedules = _.get(Mhr, "schedules", {});
      _.each(schedules, (val, key) => {
        const j = schedule.scheduleJob(key, val);
      });
      console.success("schedule job start~~~");
    }
  }
  // schedules: {
  //   "1 * * * * *": () => {
  //     console.log("Test");
  //   }
  // }
};
