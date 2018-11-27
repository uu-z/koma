const { koma } = require("../../index");
const config = require("./config");

koma.$use({
  start: {
    metas: {
      mongoose: {
        load: true
      },
      graphql: {
        load: true
      },
      redis: {
        load: true
      },
      "redis-cache": {
        load: true
      }
    },
    config,
    load: {
      modules: ["./examples/advanced/modules"]
    }
  }
});
