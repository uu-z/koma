const { koma } = require("../../index");
const config = require("./config");

koma.$use({
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
  load: {
    modules: ["./examples/advanced/modules"]
  },
  start: { config }
});
